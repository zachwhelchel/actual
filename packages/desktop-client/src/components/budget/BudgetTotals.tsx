import React, { type ComponentProps, memo, useRef, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import { SvgDotsHorizontalTriple } from '../../icons/v1';
import { theme, styles } from '../../style';
import Coach, { CoachProvider, useCoach } from '../coach/Coach';
import { Button } from '../common/Button2';
import { Menu } from '../common/Menu';
import { Popover } from '../common/Popover';
import { View } from '../common/View';

import { RenderMonths } from './RenderMonths';
import { getScrollbarWidth } from './util';

type BudgetTotalsProps = {
  MonthComponent: ComponentProps<typeof RenderMonths>['component'];
  toggleHiddenCategories: () => void;
  expandAllCategories: () => void;
  collapseAllCategories: () => void;
};

export const BudgetTotals = memo(function BudgetTotals({
  MonthComponent,
  toggleHiddenCategories,
  hiddenCategoriesState,
  expandAllCategories,
  collapseAllCategories,
}: BudgetTotalsProps) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { commonElementsRef } = useCoach(); // this is causing the errors.
  const triggerRef = useRef(null);

  return (
    <View
      data-testid="budget-totals"
      style={{
        backgroundColor: theme.tableBackground,
        flexDirection: 'row',
        flexShrink: 0,
        boxShadow: styles.cardShadow,
        marginLeft: 5,
        marginRight: 5 + getScrollbarWidth(),
        borderRadius: '4px 4px 0 0',
        borderBottom: '1px solid ' + theme.tableBorder,
      }}
    >
      <View
        style={{
          width: 200,
          color: theme.pageTextLight,
          justifyContent: 'center',
          paddingLeft: 15,
          paddingRight: 5,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        <div
          style={{ flexGrow: '1' }}
          ref={element => {
            commonElementsRef.current['category_column'] = element;
          }}
        >
          <View style={{ flexGrow: '1' }}>
            <Trans>Category</Trans>
          </View>
        </div>
        <Button
          ref={triggerRef}
          variant="bare"
          aria-label={t('Menu')}
          onPress={() => setMenuOpen(true)}
          style={{ color: 'currentColor', padding: 3 }}
        >
          <SvgDotsHorizontalTriple
            width={15}
            height={15}
            style={{ color: theme.pageTextLight }}
          />
        </Button>

        <Popover
          triggerRef={triggerRef}
          isOpen={menuOpen}
          onOpenChange={() => setMenuOpen(false)}
          style={{ width: 200 }}
        >
          <Menu
            onMenuSelect={type => {
              if (type === 'toggle-visibility') {
                toggleHiddenCategories();
              } else if (type === 'expandAllCategories') {
                expandAllCategories();
              } else if (type === 'collapseAllCategories') {
                collapseAllCategories();
              }
              setMenuOpen(false);
            }}
            items={[
              {
                name: 'toggle-visibility',
                text: t('Toggle hidden categories'),
              },
              {
                name: 'expandAllCategories',
                text: t('Expand all'),
              },
              {
                name: 'collapseAllCategories',
                text: t('Collapse all'),
              },
            ]}
          />
        </Popover>
      </View>
      <RenderMonths component={MonthComponent} />
    </View>
  );
});
