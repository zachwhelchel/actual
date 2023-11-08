import React from 'react';

import { theme } from '../../style';
import { Row } from '../table';

import RenderMonths from './RenderMonths';
import SidebarGroup from './SidebarGroup';

function IncomeGroup({
  group,
  editingCell,
  collapsed,
  MonthComponent,
  onEditName,
  categoriesRef,
  onSave,
  onToggleCollapse,
  onShowNewCategory,
}) {
  return (
    <Row
      collapsed={true}
      style={{ fontWeight: 600, backgroundColor: theme.altTableBackground }}
    >
      <SidebarGroup
        group={group}
        collapsed={collapsed}
        editing={
          editingCell &&
          editingCell.cell === 'name' &&
          editingCell.id === group.id
        }
        onEdit={onEditName}
        categoriesRef={categoriesRef}
        onSave={onSave}
        onToggleCollapse={onToggleCollapse}
        onShowNewCategory={onShowNewCategory}
      />
      <RenderMonths component={MonthComponent} args={{ group }} />
    </Row>
  );
}

export default IncomeGroup;
