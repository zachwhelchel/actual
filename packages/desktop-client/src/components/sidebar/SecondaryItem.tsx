// @ts-strict-ignore
import React, {
  type ComponentType,
  type MouseEventHandler,
  type SVGProps,
} from 'react';

import { theme, type CSSProperties } from '../../style';
import { Block } from '../common/Block';
import { View } from '../common/View';

import { accountNameStyle } from './Account';
import { ItemContent } from './ItemContent';
import { useCoach } from '../coach/Coach';

const fontWeight = 600;

type SecondaryItemProps = {
  title: string;
  to?: string;
  Icon?:
    | ComponentType<SVGProps<SVGElement>>
    | ComponentType<SVGProps<SVGSVGElement>>;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
  bold?: boolean;
  indent?: number;
  badge?: number;
};

export function SecondaryItem({
  Icon,
  title,
  style,
  to,
  onClick,
  bold,
  indent = 0,
  badge = 0,
  refForHighlighting,
}: SecondaryItemProps) {
  const content = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 16,
      }}
    >
      {Icon && <Icon width={12} height={12} />}
      <Block style={{ marginLeft: Icon ? 8 : 0, color: 'inherit' }}>
        {title}
      </Block>
      {badge > 0 && (
        <div style={{
          backgroundColor: theme.errorText,
          width: 'fit-content',
          paddingTop: '2px',
          paddingLeft: '8px',
          paddingRight: '8px',
          borderRadius: '12px',
          paddingTop: '-100px',
          marginLeft: '10px'
        }}>
          { badge }
        </div>
      )}
    </View>
  );

  let { commonElementsRef } = useCoach(); // this is causing the errors.

  return (
    <View style={{ flexShrink: 0, ...style }}>
      <ItemContent
        style={{
          ...accountNameStyle,
          color: theme.sidebarItemText,
          paddingLeft: 14 + indent,
          fontWeight: bold ? fontWeight : null,
          ':hover': { backgroundColor: theme.sidebarItemBackgroundHover },
        }}
        to={to}
        onClick={onClick}
        activeStyle={{
          borderLeft: '4px solid ' + theme.sidebarItemTextSelected,
          paddingLeft: 14 - 4 + indent,
          color: theme.sidebarItemTextSelected,
          fontWeight: bold ? fontWeight : null,
        }}
      >
        <div
          ref={element => {
            commonElementsRef.current[refForHighlighting] = element;
          }}
        >
          {content}
        </div>
      </ItemContent>



    </View>
  );
}
