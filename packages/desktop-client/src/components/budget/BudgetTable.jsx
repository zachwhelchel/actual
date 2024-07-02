import React, { useState } from 'react';

import { useCategories } from '../../hooks/useCategories';
import { useLocalPref } from '../../hooks/useLocalPref';
import { theme, styles } from '../../style';
import { View } from '../common/View';
import { Button } from '../common/Button';

import { BudgetCategories } from './BudgetCategories';
import { BudgetSummaries } from './BudgetSummaries';
import { BudgetTotals } from './BudgetTotals';
import { MonthsProvider } from './MonthsContext';
import { findSortDown, findSortUp, getScrollbarWidth } from './util';
import { SvgStepBackward, SvgStepForward } from '../../icons/v1';

export function BudgetTable(props) {
  const {
    type,
    prewarmStartMonth,
    startMonth,
    numMonths,
    monthBounds,
    dataComponents,
    onSaveCategory,
    onDeleteCategory,
    onSaveGroup,
    onDeleteGroup,
    onReorderCategory,
    onReorderGroup,
    onShowActivity,
    onBudgetAction,
  } = props;

  const { grouped: categoryGroups } = useCategories();
  const [collapsedGroupIds = [], setCollapsedGroupIdsPref] =
    useLocalPref('budget.collapsed');
  const [showHiddenCategories, setShowHiddenCategoriesPef] = useLocalPref(
    'budget.showHiddenCategories',
  );
  const [editing, setEditing] = useState(null);

  const onEditMonth = (id, month) => {
    setEditing(id ? { id, cell: month } : null);
  };

  const onEditName = id => {
    setEditing(id ? { id, cell: 'name' } : null);
  };

  const _onReorderCategory = (id, dropPos, targetId) => {
    const isGroup = !!categoryGroups.find(g => g.id === targetId);

    if (isGroup) {
      const { targetId: groupId } = findSortUp(
        categoryGroups,
        dropPos,
        targetId,
      );
      const group = categoryGroups.find(g => g.id === groupId);

      if (group) {
        const { categories } = group;
        onReorderCategory({
          id,
          groupId: group.id,
          targetId:
            categories.length === 0 || dropPos === 'top'
              ? null
              : categories[0].id,
        });
      }
    } else {
      let targetGroup;

      for (const group of categoryGroups) {
        if (group.categories.find(cat => cat.id === targetId)) {
          targetGroup = group;
          break;
        }
      }

      onReorderCategory({
        id,
        groupId: targetGroup.id,
        ...findSortDown(targetGroup.categories, dropPos, targetId),
      });
    }
  };

  const _onReorderGroup = (id, dropPos, targetId) => {
    onReorderGroup({
      id,
      ...findSortDown(categoryGroups, dropPos, targetId),
    });
  };

  const moveVertically = dir => {
    const flattened = categoryGroups.reduce((all, group) => {
      if (collapsedGroupIds.includes(group.id)) {
        return all.concat({ id: group.id, isGroup: true });
      }
      return all.concat([{ id: group.id, isGroup: true }, ...group.categories]);
    }, []);

    if (editing) {
      const idx = flattened.findIndex(item => item.id === editing.id);
      let nextIdx = idx + dir;

      while (nextIdx >= 0 && nextIdx < flattened.length) {
        const next = flattened[nextIdx];

        if (next.isGroup) {
          nextIdx += dir;
          continue;
        } else if (type === 'report' || !next.is_income) {
          onEditMonth(next.id, editing.cell);
          return;
        } else {
          break;
        }
      }
    }
  };

  const onKeyDown = e => {
    if (!editing) {
      return null;
    }

    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      moveVertically(e.shiftKey ? -1 : 1);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.moveVertically(-1);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.moveVertically(1);
    }
  };

  const onCollapse = collapsedIds => {
    setCollapsedGroupIdsPref(collapsedIds);
  };

  const onToggleHiddenCategories = () => {
    setShowHiddenCategoriesPef(!showHiddenCategories);
  };

  const toggleHiddenCategories = () => {
    onToggleHiddenCategories();
  };

  const expandAllCategories = () => {
    onCollapse([]);
  };

  const collapseAllCategories = () => {
    onCollapse(categoryGroups.map(g => g.id));
  };

  return (
    <View
      data-testid="budget-table"
      style={{
        flex: 1,
        ...(styles.lightScrollbar && {
          '& ::-webkit-scrollbar': {
            backgroundColor: 'transparent',
          },
          '& ::-webkit-scrollbar-thumb:vertical': {
            backgroundColor: theme.tableHeaderBackground,
          },
        }),
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          overflow: 'hidden',
          flexShrink: 0,
          // This is necessary to align with the table because the
          // table has this padding to allow the shadow to show
          paddingLeft: 5,
          paddingRight: 5 + getScrollbarWidth(),
        }}
      >
        <View style={{ width: 200, display: 'flex', justifyContent: 'space-between', flexDirection: 'row', paddingBottom: 10, paddingLeft: 35, paddingRight: 35}}>
          <Button type="bare" style={{ alignSelf: 'flex-end' }} onClick={() => window.__actionsForMenu.undo()}>
            <SvgStepBackward width={16} height={16} style={{ marginRight: 3 }} /> Undo
          </Button>

          <Button type="bare" style={{ alignSelf: 'flex-end' }} onClick={() => window.__actionsForMenu.redo()}>
            Redo <SvgStepForward width={16} height={16} style={{ marginLeft: 3 }} />
          </Button>
        </View>

        <MonthsProvider
          startMonth={prewarmStartMonth}
          numMonths={numMonths}
          monthBounds={monthBounds}
          type={type}
        >
          <BudgetSummaries SummaryComponent={dataComponents.SummaryComponent} />
        </MonthsProvider>
      </View>

      <MonthsProvider
        startMonth={startMonth}
        numMonths={numMonths}
        monthBounds={monthBounds}
        type={type}
      >
        <BudgetTotals
          MonthComponent={dataComponents.BudgetTotalsComponent}
          toggleHiddenCategories={toggleHiddenCategories}
          expandAllCategories={expandAllCategories}
          collapseAllCategories={collapseAllCategories}
        />
        <View
          style={{
            overflowY: 'scroll',
            overflowAnchor: 'none',
            flex: 1,
            paddingLeft: 5,
            paddingRight: 5,
          }}
        >
          <View
            style={{
              flexShrink: 0,
            }}
            onKeyDown={onKeyDown}
          >
            <BudgetCategories
              categoryGroups={categoryGroups}
              editingCell={editing}
              dataComponents={dataComponents}
              onEditMonth={onEditMonth}
              onEditName={onEditName}
              onSaveCategory={onSaveCategory}
              onSaveGroup={onSaveGroup}
              onDeleteCategory={onDeleteCategory}
              onDeleteGroup={onDeleteGroup}
              onReorderCategory={_onReorderCategory}
              onReorderGroup={_onReorderGroup}
              onBudgetAction={onBudgetAction}
              onShowActivity={onShowActivity}
            />
          </View>
        </View>
      </MonthsProvider>
    </View>
  );
}

BudgetTable.displayName = 'BudgetTable';
