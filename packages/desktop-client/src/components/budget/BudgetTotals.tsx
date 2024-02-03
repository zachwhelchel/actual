import React, { type ComponentProps, memo, useState } from 'react';

import { SvgDotsHorizontalTriple } from '../../icons/v1';
import { theme, styles } from '../../style';
import { Button } from '../common/Button';
import { Menu } from '../common/Menu';
import { View } from '../common/View';
import { Tooltip } from '../tooltips';

import { RenderMonths } from './RenderMonths';
import { getScrollbarWidth } from './util';
import Coach, { CoachProvider, useCoach } from '../coach/Coach';

type BudgetTotalsProps = {
  MonthComponent: ComponentProps<typeof RenderMonths>['component'];
  toggleHiddenCategories: () => void;
  expandAllCategories: () => void;
  collapseAllCategories: () => void;
};

export const BudgetTotals = memo(function BudgetTotals({
  MonthComponent,
  toggleHiddenCategories,
  expandAllCategories,
  collapseAllCategories,
}: BudgetTotalsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  let { commonElementsRef } = useCoach(); // this is causing the errors.

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
          <View style={{ flexGrow: '1' }}>Category</View>
        </div>            
        <Button
          type="bare"
          aria-label="Menu"
          onClick={() => {
            setMenuOpen(true);
          }}
          style={{ color: 'currentColor', padding: 3 }}
        >
          <SvgDotsHorizontalTriple
            width={15}
            height={15}
            style={{ color: theme.pageTextLight }}
          />
          {menuOpen && (
            <Tooltip
              position="bottom-right"
              width={200}
              style={{ padding: 0 }}
              onClose={() => {
                setMenuOpen(false);
              }}
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
                    text: 'Toggle hidden categories',
                  },
                  {
                    name: 'expandAllCategories',
                    text: 'Expand all',
                  },
                  {
                    name: 'collapseAllCategories',
                    text: 'Collapse all',
                  },
                ]}
              />
            </Tooltip>
          )}
        </Button>
      </View>
      <RenderMonths component={MonthComponent} />
    </View>
  );
});
