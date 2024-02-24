import React, { createRef, Component } from 'react';

import * as monthUtils from 'loot-core/src/shared/months';

import { theme, styles } from '../../style';
import { View } from '../common/View';
import { IntersectionBoundary } from '../tooltips';
import { Button } from '../common/Button';

import { BudgetCategories } from './BudgetCategories';
import { BudgetSummaries } from './BudgetSummaries';
import { BudgetTotals } from './BudgetTotals';
import { MonthsProvider } from './MonthsContext';
import { findSortDown, findSortUp, getScrollbarWidth } from './util';
import { SvgStepBackward, SvgStepForward } from '../../icons/v1';

export class BudgetTable extends Component {
  constructor(props) {
    super(props);
    this.budgetCategoriesRef = createRef();

    this.state = {
      editing: null,
      draggingState: null,
      showHiddenCategories: props.prefs['budget.showHiddenCategories'] ?? false,
    };
  }

  onEditMonth = (id, monthIndex) => {
    this.setState({ editing: id ? { id, cell: monthIndex } : null });
  };

  onEditName = id => {
    this.setState({ editing: id ? { id, cell: 'name' } : null });
  };

  onReorderCategory = (id, dropPos, targetId) => {
    const { categoryGroups } = this.props;

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
        this.props.onReorderCategory({
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

      this.props.onReorderCategory({
        id,
        groupId: targetGroup.id,
        ...findSortDown(targetGroup.categories, dropPos, targetId),
      });
    }
  };

  onReorderGroup = (id, dropPos, targetId) => {
    const { categoryGroups } = this.props;

    this.props.onReorderGroup({
      id,
      ...findSortDown(categoryGroups, dropPos, targetId),
    });
  };

  moveVertically = dir => {
    const { editing } = this.state;
    const { type, categoryGroups, collapsed } = this.props;

    const flattened = categoryGroups.reduce((all, group) => {
      if (collapsed.includes(group.id)) {
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
          this.onEditMonth(next.id, editing.cell);
          return;
        } else {
          break;
        }
      }
    }
  };

  onKeyDown = e => {
    if (!this.state.editing) {
      return null;
    }

    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      this.moveVertically(e.shiftKey ? -1 : 1);
    }
  };

  onShowActivity = (catName, catId, monthIndex) => {
    this.props.onShowActivity(catName, catId, this.resolveMonth(monthIndex));
  };

  onBudgetAction = (monthIndex, type, args) => {
    this.props.onBudgetAction(this.resolveMonth(monthIndex), type, args);
  };

  resolveMonth = monthIndex => {
    return monthUtils.addMonths(this.props.startMonth, monthIndex);
  };

  clearEditing() {
    this.setState({ editing: null });
  }

  toggleHiddenCategories = () => {
    this.setState(prevState => ({
      showHiddenCategories: !prevState.showHiddenCategories,
    }));
    this.props.savePrefs({
      'budget.showHiddenCategories': !this.state.showHiddenCategories,
    });
  };

  hiddenCategoriesState = () => {
    return this.state.showHiddenCategories;
  };

  expandAllCategories = () => {
    this.props.setCollapsed([]);
  };

  collapseAllCategories = () => {
    const { setCollapsed, categoryGroups } = this.props;
    setCollapsed(categoryGroups.map(g => g.id));
  };

  render() {
    const {
      type,
      categoryGroups,
      prewarmStartMonth,
      startMonth,
      numMonths,
      monthBounds,
      collapsed,
      setCollapsed,
      newCategoryForGroup,
      dataComponents,
      isAddingGroup,
      categoriesRef,
      onSaveCategory,
      onSaveGroup,
      onDeleteCategory,
      onDeleteGroup,
      onShowNewCategory,
      onHideNewCategory,
      onShowNewGroup,
      onHideNewGroup,
    } = this.props;
    const { editing, draggingState, showHiddenCategories } = this.state;

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
            <BudgetSummaries
              SummaryComponent={dataComponents.SummaryComponent}
            />
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
            toggleHiddenCategories={this.toggleHiddenCategories}
            hiddenCategoriesState={this.hiddenCategoriesState}
            expandAllCategories={this.expandAllCategories}
            collapseAllCategories={this.collapseAllCategories}
          />
          <IntersectionBoundary.Provider value={this.budgetCategoriesRef}>
            <View
              style={{
                overflowY: 'scroll',
                overflowAnchor: 'none',
                flex: 1,
                paddingLeft: 5,
                paddingRight: 5,
              }}
              innerRef={this.budgetCategoriesRef}
            >
              <View
                style={{
                  opacity: draggingState ? 0.5 : 1,
                  flexShrink: 0,
                }}
                onKeyDown={this.onKeyDown}
                innerRef={el => (this.budgetDataNode = el)}
              >
                <BudgetCategories
                  showHiddenCategories={showHiddenCategories}
                  categoryGroups={categoryGroups}
                  newCategoryForGroup={newCategoryForGroup}
                  isAddingGroup={isAddingGroup}
                  editingCell={editing}
                  collapsed={collapsed}
                  setCollapsed={setCollapsed}
                  dataComponents={dataComponents}
                  onEditMonth={this.onEditMonth}
                  onEditName={this.onEditName}
                  categoriesRef={categoriesRef}
                  onSaveCategory={onSaveCategory}
                  onSaveGroup={onSaveGroup}
                  onDeleteCategory={onDeleteCategory}
                  onDeleteGroup={onDeleteGroup}
                  onReorderCategory={this.onReorderCategory}
                  onReorderGroup={this.onReorderGroup}
                  onShowNewCategory={onShowNewCategory}
                  onHideNewCategory={onHideNewCategory}
                  onShowNewGroup={onShowNewGroup}
                  onHideNewGroup={onHideNewGroup}
                  onBudgetAction={this.onBudgetAction}
                  onShowActivity={this.onShowActivity}
                />
              </View>
            </View>
          </IntersectionBoundary.Provider>
        </MonthsProvider>
      </View>
    );
  }
}
