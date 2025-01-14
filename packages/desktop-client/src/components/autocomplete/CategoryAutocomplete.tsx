import React, {
  type ComponentProps,
  Fragment,
  useMemo,
  type ReactNode,
  type SVGProps,
  type ComponentType,
  useState,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type CSSProperties,
  useCallback,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { css, cx } from '@emotion/css';

import { trackingBudget, envelopeBudget } from 'loot-core/client/queries';
import { integerToCurrency } from 'loot-core/shared/util';
import { getNormalisedString } from 'loot-core/src/shared/normalisation';
import {
  type CategoryEntity,
  type CategoryGroupEntity,
} from 'loot-core/src/types/models';

import { useCategories } from '../../hooks/useCategories';
import { useSyncedPref } from '../../hooks/useSyncedPref';
import { SvgSplit } from '../../icons/v0';
import { theme, styles } from '../../style';
import { useEnvelopeSheetValue } from '../budget/envelope/EnvelopeBudgetComponents';
import { makeAmountFullStyle } from '../budget/util';
import { Text } from '../common/Text';
import { TextOneLine } from '../common/TextOneLine';
import { View } from '../common/View';
import { useResponsive } from '../responsive/ResponsiveProvider';
import { useSheetValue } from '../spreadsheet/useSheetValue';

import { SvgAdd } from '../../icons/v1';

import { Autocomplete, defaultFilterSuggestion } from './Autocomplete';
import { ItemHeader } from './ItemHeader';

type CategoryAutocompleteItem = CategoryEntity & {
  group?: CategoryGroupEntity;
};

type CategoryListProps = {
  items: CategoryAutocompleteItem[];
  getItemProps?: (arg: {
    item: CategoryAutocompleteItem;
  }) => Partial<ComponentProps<typeof View>>;
  highlightedIndex: number;
  embedded?: boolean;
  footer?: ReactNode;
  renderSplitTransactionButton?: (
    props: ComponentPropsWithoutRef<typeof SplitTransactionButton>,
  ) => ReactElement<typeof SplitTransactionButton>;
  renderCategoryItemGroupHeader?: (
    props: ComponentPropsWithoutRef<typeof ItemHeader>,
  ) => ReactElement<typeof ItemHeader>;
  renderCategoryItem?: (
    props: ComponentPropsWithoutRef<typeof CategoryItem>,
  ) => ReactElement<typeof CategoryItem>;
  showHiddenItems?: boolean;
  showBalances?: boolean;
};
function CategoryList({
  items,
  getItemProps,
  highlightedIndex,
  embedded,
  footer,
  renderSplitTransactionButton = defaultRenderSplitTransactionButton,
  renderCreateCategoryButton = defaultRenderCreateCategoryButton,
  renderCategoryItemGroupHeader = defaultRenderCategoryItemGroupHeader,
  renderCategoryItem = defaultRenderCategoryItem,
  showHiddenItems,
  showBalances,
}: CategoryListProps) {
  const { t } = useTranslation();
  let lastGroup: string | undefined | null = null;

  let createNew = 'Create Category';

  const offset = createNew ? 1 : 0;

  const filteredItems = useMemo(
    () =>
      showHiddenItems
        ? items
        : items.filter(item => !item.hidden && !item.group?.hidden),
    [showHiddenItems, items],
  );

  return (
    <View>
      <View
        style={{
          overflowY: 'auto',
          willChange: 'transform',
          padding: '5px 0',
          ...(!embedded && { maxHeight: 175 }),
        }}
      >
        {filteredItems.map((item, idx) => {
          if (item.id === 'split') {
            return renderSplitTransactionButton({
              key: 'split',
              ...(getItemProps ? getItemProps({ item }) : null),
              highlighted: highlightedIndex === idx,
              embedded,
            });
          }

          const showGroup = item.cat_group !== lastGroup;
          const groupName = `${item.group?.name}${item.group?.hidden ? ' ' + t('(hidden)') : ''}`;
          lastGroup = item.cat_group;
          return (
            <Fragment key={item.id}>
              {showGroup && item.group?.name && (
                <Fragment key={item.group.name}>
                  {renderCategoryItemGroupHeader({
                    title: groupName,
                    style: {
                      ...(showHiddenItems &&
                        item.group?.hidden && { color: theme.pageTextSubdued }),
                    },
                  })}
                </Fragment>
              )}
              <Fragment key={item.id}>
                {renderCategoryItem({
                  ...(getItemProps ? getItemProps({ item }) : null),
                  item,
                  highlighted: highlightedIndex === idx,
                  embedded,
                  style: {
                    ...(showHiddenItems &&
                      item.hidden && { color: theme.pageTextSubdued }),
                  },
                  showBalances,
                })}
              </Fragment>
            </Fragment>
          );
        })}

        {createNew &&
        renderCategoryItemGroupHeader({
                    title: "New Category",
                  })}
        {createNew &&
        renderCreateCategoryButton({
          ...(getItemProps ? getItemProps({ item: createNew }) : null),
          categoryName: "inputValue",
          highlighted: highlightedIndex === items.length,
          embedded,
        })}

      </View>
      {footer}
    </View>
  );
}

function customSort(obj: CategoryAutocompleteItem, value: string): number {
  const name = getNormalisedString(obj.name);
  const groupName = obj.group ? getNormalisedString(obj.group.name) : '';
  if (obj.id === 'split') {
    return -2;
  }
  if (name.includes(value)) {
    return -1;
  }
  if (groupName.includes(value)) {
    return 0;
  }
  return 1;
}

type CategoryAutocompleteProps = ComponentProps<
  typeof Autocomplete<CategoryAutocompleteItem>
> & {
  categoryGroups?: Array<CategoryGroupEntity>;
  showBalances?: boolean;
  showSplitOption?: boolean;
  renderSplitTransactionButton?: (
    props: ComponentPropsWithoutRef<typeof SplitTransactionButton>,
  ) => ReactElement<typeof SplitTransactionButton>;
  renderCategoryItemGroupHeader?: (
    props: ComponentPropsWithoutRef<typeof ItemHeader>,
  ) => ReactElement<typeof ItemHeader>;
  renderCategoryItem?: (
    props: ComponentPropsWithoutRef<typeof CategoryItem>,
  ) => ReactElement<typeof CategoryItem>;
  showHiddenCategories?: boolean;
};

export function CategoryAutocomplete({
  categoryGroups,
  showBalances = true,
  showSplitOption,
  embedded,
  closeOnBlur,
  renderSplitTransactionButton,
  renderCreateCategoryButton = defaultRenderCreateCategoryButton,
  renderCategoryItemGroupHeader,
  renderCategoryItem,
  showHiddenCategories,
  ...props
}: CategoryAutocompleteProps) {
  const { grouped: defaultCategoryGroups = [] } = useCategories();
  const categorySuggestions: CategoryAutocompleteItem[] = useMemo(
    () =>
      (categoryGroups || defaultCategoryGroups).reduce(
        (list, group) =>
          list.concat(
            (group.categories || [])
              .filter(category => category.cat_group === group.id)
              .map(category => ({
                ...category,
                group,
              })),
          ),
        showSplitOption ? [{ id: 'split', name: '' } as CategoryEntity] : [],
      ),
    [defaultCategoryGroups, categoryGroups, showSplitOption],
  );

  const filterSuggestions = useCallback(
    (
      suggestions: CategoryAutocompleteItem[],
      value: string,
    ): CategoryAutocompleteItem[] => {
      return suggestions
        .filter(suggestion => {
          if (suggestion.id === 'split') {
            return true;
          }

          if (suggestion.group) {
            return (
              getNormalisedString(suggestion.group.name).includes(
                getNormalisedString(value),
              ) ||
              getNormalisedString(
                suggestion.group.name + ' ' + suggestion.name,
              ).includes(getNormalisedString(value))
            );
          }

          return defaultFilterSuggestion(suggestion, value);
        })
        .sort(
          (a, b) =>
            customSort(a, getNormalisedString(value)) -
            customSort(b, getNormalisedString(value)),
        );
    },
    [],
  );

  return (
    <Autocomplete
      strict={true}
      highlightFirst={true}
      embedded={embedded}
      closeOnBlur={closeOnBlur}
      getHighlightedIndex={suggestions => {
        if (suggestions.length === 0) {
          return null;
        } else if (suggestions[0].id === 'split') {
          return suggestions.length > 1 ? 1 : null;
        }
        return 0;
      }}
      filterSuggestions={filterSuggestions}
      suggestions={categorySuggestions}
      renderItems={(items, getItemProps, highlightedIndex) => (
        <CategoryList
          items={items}
          embedded={embedded}
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          renderSplitTransactionButton={renderSplitTransactionButton}
          renderCreateCategoryButton={renderCreateCategoryButton}
          renderCategoryItemGroupHeader={renderCategoryItemGroupHeader}
          renderCategoryItem={renderCategoryItem}
          showHiddenItems={showHiddenCategories}
          showBalances={showBalances}
        />
      )}
      {...props}
    />
  );
}

type CreateCategoryButtonProps = {
  Icon?: ComponentType<SVGProps<SVGElement>>;
  categoryName: string;
  highlighted?: boolean;
  embedded?: boolean;
  style?: CSSProperties;
};

export function CreateCategoryButton({
  Icon,
  categoryName,
  highlighted,
  embedded,
  style,
  ...props
}: CreateCategoryButtonProps) {
  const { isNarrowWidth } = useResponsive();
  return (
    <View
      data-testid="create-category-button"
      style={{
        display: 'block',
        flexShrink: 0,
        color: highlighted
          ? theme.menuAutoCompleteItemTextHover
          : theme.menuAutoCompleteItemText,
        borderRadius: embedded ? 4 : 0,
        fontSize: isNarrowWidth ? 17 : 11,
        fontWeight: isNarrowWidth ? 425 : 500,
        padding: '6px 9px',
          backgroundColor: highlighted
            ? theme.menuAutoCompleteBackgroundHover
            : 'transparent',
        ':active': {
          backgroundColor: 'rgba(100, 100, 100, .25)',
        },
        ...style,
      }}
      {...props}
    >
      {Icon ? (
        <Icon style={{ marginRight: 5, display: 'inline-block' }} />
      ) : (
        <SvgAdd
          width={8}
          height={8}
          style={{ marginRight: 5, display: 'inline-block' }}
        />
      )}
      Create Category
    </View>
  );
}

function defaultRenderCreateCategoryButton(
  props: CreateCategoryButtonProps,
): ReactNode {
  return <CreateCategoryButton {...props} />;
}

type CategoryItemGroupHeaderProps = {
  title: string;
  style?: CSSProperties;
};

export function CategoryItemGroupHeader({
  title,
  style,
  ...props
}: CategoryItemGroupHeaderProps) {
  return (
    <div
      style={{
        color: theme.menuAutoCompleteTextHeader,
        padding: '4px 9px',
        ...style,
      }}
      data-testid={`${title}-category-item-group`}
      {...props}
    >
      {title}
    </div>
  );
}

function defaultRenderCategoryItemGroupHeader(
  props: ComponentPropsWithoutRef<typeof ItemHeader>,
): ReactElement<typeof ItemHeader> {
  return <ItemHeader {...props} type="category" />;
}

type SplitTransactionButtonProps = {
  Icon?: ComponentType<SVGProps<SVGElement>>;
  highlighted?: boolean;
  embedded?: boolean;
  style?: CSSProperties;
};

function SplitTransactionButton({
  Icon,
  highlighted,
  embedded,
  style,
  ...props
}: SplitTransactionButtonProps) {
  return (
    <View
      // Downshift calls `setTimeout(..., 250)` in the `onMouseMove`
      // event handler they set on this element. When this code runs
      // in WebKit on touch-enabled devices, taps on this element end
      // up not triggering the `onClick` event (and therefore delaying
      // response to user input) until after the `setTimeout` callback
      // finishes executing. This is caused by content observation code
      // that implements various strategies to prevent the user from
      // accidentally clicking content that changed as a result of code
      // run in the `onMouseMove` event.
      //
      // Long story short, we don't want any delay here between the user
      // tapping and the resulting action being performed. It turns out
      // there's some "fast path" logic that can be triggered in various
      // ways to force WebKit to bail on the content observation process.
      // One of those ways is setting `role="button"` (or a number of
      // other aria roles) on the element, which is what we're doing here.
      //
      // ref:
      // * https://github.com/WebKit/WebKit/blob/447d90b0c52b2951a69df78f06bb5e6b10262f4b/LayoutTests/fast/events/touch/ios/content-observation/400ms-hover-intent.html
      // * https://github.com/WebKit/WebKit/blob/58956cf59ba01267644b5e8fe766efa7aa6f0c5c/Source/WebCore/page/ios/ContentChangeObserver.cpp
      // * https://github.com/WebKit/WebKit/blob/58956cf59ba01267644b5e8fe766efa7aa6f0c5c/Source/WebKit/WebProcess/WebPage/ios/WebPageIOS.mm#L783
      role="button"
      style={{
        backgroundColor: highlighted
          ? theme.menuAutoCompleteBackgroundHover
          : 'transparent',
        borderRadius: embedded ? 4 : 0,
        flexShrink: 0,
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 11,
        fontWeight: 500,
        color: theme.noticeTextMenu,
        padding: '6px 8px',
        ':active': {
          backgroundColor: 'rgba(100, 100, 100, .25)',
        },
        ...style,
      }}
      data-testid="split-transaction-button"
      {...props}
    >
      <Text style={{ lineHeight: 0 }}>
        {Icon ? (
          <Icon style={{ marginRight: 5 }} />
        ) : (
          <SvgSplit width={10} height={10} style={{ marginRight: 5 }} />
        )}
      </Text>
      <Trans>Split Transaction</Trans>
    </View>
  );
}

function defaultRenderSplitTransactionButton(
  props: SplitTransactionButtonProps,
): ReactElement<typeof SplitTransactionButton> {
  return <SplitTransactionButton {...props} />;
}

type CategoryItemProps = {
  item: CategoryAutocompleteItem;
  className?: string;
  style?: CSSProperties;
  highlighted?: boolean;
  embedded?: boolean;
  showBalances?: boolean;
};

function CategoryItem({
  item,
  className,
  style,
  highlighted,
  embedded,
  showBalances,
  ...props
}: CategoryItemProps) {
  const { t } = useTranslation();
  const { isNarrowWidth } = useResponsive();
  const narrowStyle = isNarrowWidth
    ? {
        ...styles.mobileMenuItem,
        borderRadius: 0,
        borderTop: `1px solid ${theme.pillBorder}`,
      }
    : {};
  const [budgetType = 'rollover'] = useSyncedPref('budgetType');

  const balanceBinding =
    budgetType === 'rollover'
      ? envelopeBudget.catBalance(item.id)
      : trackingBudget.catBalance(item.id);
  const balance = useSheetValue<
    'envelope-budget' | 'tracking-budget',
    typeof balanceBinding
  >(balanceBinding);

  const isToBeBudgetedItem = item.id === 'to-be-budgeted';
  const toBudget = useEnvelopeSheetValue(envelopeBudget.toBudget);

  return (
    <div
      style={style}
      // See comment above.
      role="button"
      className={cx(
        className,
        css({
          backgroundColor: highlighted
            ? theme.menuAutoCompleteBackgroundHover
            : 'transparent',
          color: highlighted
            ? theme.menuAutoCompleteItemTextHover
            : theme.menuAutoCompleteItemText,
          padding: 4,
          paddingLeft: 20,
          borderRadius: embedded ? 4 : 0,
          ...narrowStyle,
        }),
      )}
      data-testid={`${item.name}-category-item`}
      data-highlighted={highlighted || undefined}
      {...props}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextOneLine>
          {item.name}
          {item.hidden ? ' ' + t('(hidden)') : null}
        </TextOneLine>
        <TextOneLine
          style={{
            display: !showBalances ? 'none' : undefined,
            marginLeft: 5,
            flexShrink: 0,
            ...makeAmountFullStyle(
              (isToBeBudgetedItem ? toBudget : balance) || 0,
              {
                positiveColor: theme.noticeTextMenu,
                negativeColor: theme.errorTextMenu,
              },
            ),
          }}
        >
          {isToBeBudgetedItem
            ? toBudget != null
              ? ` ${integerToCurrency(toBudget || 0)}`
              : null
            : balance != null
              ? ` ${integerToCurrency(balance || 0)}`
              : null}
        </TextOneLine>
      </View>
    </div>
  );
}

function defaultRenderCategoryItem(
  props: ComponentPropsWithoutRef<typeof CategoryItem>,
): ReactElement<typeof CategoryItem> {
  return <CategoryItem {...props} />;
}
