import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import {
  SvgCheveronDown,
  SvgCheveronRight,
  SvgCog,
  SvgReports,
  SvgStoreFront,
  SvgTuning,
  SvgWallet,
  SvgChatBubbleDots,
} from '../../icons/v1';
import { SvgCalendar } from '../../icons/v2';
import { View } from '../common/View';

import { Item } from './Item';
import { SecondaryItem } from './SecondaryItem';
import Coach, { CoachProvider, useCoach } from '../coach/Coach';

export function PrimaryButtons() {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const onToggle = useCallback(() => setOpen(open => !open), []);
  const location = useLocation();

  const isActive = ['/payees', '/rules', '/settings', '/tools'].some(route =>
    location.pathname.startsWith(route),
  );

  useEffect(() => {
    if (isActive) {
      setOpen(true);
    }
  }, [isActive, location.pathname]);

  let { totalUnreadCount, commonElementsRef } = useCoach(); // this is causing the errors.


  return (
    <View style={{ flexShrink: 0 }}>
      <div
        ref={element => {
          commonElementsRef.current['budget_button'] = element;
        }}
      >
        <Item title={t('Budget')} Icon={SvgWallet} to="/budget" />
      </div>
      <Item title={t('Reports')} Icon={SvgReports} to="/reports" />
      <Item title={t('Schedules')} Icon={SvgCalendar} to="/schedules" />
      <div
        ref={element => {
          commonElementsRef.current['message_center'] = element;
        }}
      >
        <Item title="Messages" badge={totalUnreadCount} Icon={SvgChatBubbleDots} to="/coachmessagecenter" />
      </div>

      <Item
        title={t('More')}
        Icon={isOpen ? SvgCheveronDown : SvgCheveronRight}
        onClick={onToggle}
        style={{ marginBottom: isOpen ? 8 : 0 }}
        forceActive={!isOpen && isActive}
      />
      {isOpen && (
        <>
          <SecondaryItem
            title={t('Payees')}
            Icon={SvgStoreFront}
            to="/payees"
            indent={15}
          />
          <SecondaryItem
            title={t('Rules')}
            Icon={SvgTuning}
            to="/rules"
            indent={15}
          />
          <SecondaryItem
            title={t('Settings')}
            Icon={SvgCog}
            to="/settings"
            indent={15}
          />
        </>
      )}
    </View>
  );
}
