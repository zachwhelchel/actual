// @ts-strict-ignore
import React, { useState } from 'react';

import { useLiveQuery } from 'loot-core/src/client/query-hooks';
import { send } from 'loot-core/src/platform/client/fetch';
import { q } from 'loot-core/src/shared/query';

import { SvgTarget } from '../icons/v1';
import { type CSSProperties, theme } from '../style';

import { Button } from './common/Button';
import { View } from './common/View';
import { Select } from './common/Select';
import { Notes } from './Notes';
import { Tooltip, type TooltipPosition, useTooltip } from './tooltips';

type NotesTooltipProps = {
  editable?: boolean;
  defaultNotes?: string;
  position?: TooltipPosition;
  onClose?: (notes: string) => void;
};
function NotesTooltip({
  editable,
  defaultNotes,
  position = 'bottom-left',
  onClose,
}: NotesTooltipProps) {
  const [notes, setNotes] = useState<string>(defaultNotes);

  const [primaryIntent, setPrimaryIntent] = useState<string>('be_able_to_spend');
  const [frequency, setFrequency] = useState<string>('every_month');
  const [extras, setExtras] = useState<string>('removing');
  const [howLong, setHowLong] = useState<string>('no_matter_the_balance');
  const [repeat, setRepeat] = useState<string>('never');
  const [whenSpent, setWhenSpent] = useState<string>('all_at_once');

  //save = budget? be_able_to_spend = budget up to?
  const primaryIntentList = [['be_able_to_spend', 'start each month with'], ['save', 'allocate']];
  const frequencyList = [['every_month', 'every month'], ['every_week', 'every week'], ['every_2_weeks', 'every 2 weeks'], ['by', 'by']];
  const extrasList = [['removing', 'remove'], ['leaving', 'leave']];
  const howLongList = [['no_matter_the_balance', 'remove this goal'], ['until_I_save_up_to', 'save up to']];
  const repeatList = [['never', 'never'], ['every_6_months', 'every 6 months'], ['every_year', 'every year'], ['every_2_years', 'every 2 years']];
  const whenSpentList = [['along_the_way', 'along the way'], ['all_at_once', 'all at once']];

  const [order, setOrder] = useState<string>(["I", "want", "to", "_primaryIntent", "$50", "available", "and", "_extras", "any", "extra", "balance", "that", "may", "have", "accumulated."]);

  let orderList = [];

  order.forEach((item, index) => {
    if (item === '_primaryIntent') {
      orderList.push(<Select options={primaryIntentList} value={primaryIntent} onChange={newValue => handleOnChangePrimaryIntent(newValue)}/>);
    } else if (item === '_frequency') {
      orderList.push(<Select options={frequencyList} value={frequency} onChange={newValue => handleOnChangeFrequency(newValue)}/>);
    } else if (item === '_extras') {
      orderList.push(<Select options={extrasList} value={extras} onChange={newValue => handleOnChangeExtras(newValue)}/>);
    } else if (item === '_howLong') {
      orderList.push(<Select options={howLongList} value={howLong} onChange={newValue => handleOnChangeHowLong(newValue)}/>);
    } else if (item === '_repeat') {
      orderList.push(<Select options={repeatList} value={repeat} onChange={newValue => handleOnChangeRepeat(newValue)}/>);
    } else if (item === '_whenSpent') {
      orderList.push(<Select options={whenSpentList} value={whenSpent} onChange={newValue => handleOnChangeWhenSpent(newValue)}/>);
    } else {
      orderList.push(<View>{item}</View>);
    }
  });

  function handleOnChangePrimaryIntent(newValue) {
    setPrimaryIntent(newValue);
    handleStuff(newValue, frequency, extras, howLong, repeat, whenSpent);
  }

  function handleOnChangeFrequency(newValue) {
    setFrequency(newValue);
    handleStuff(primaryIntent, newValue, extras, howLong, repeat, whenSpent);
  }

  function handleOnChangeExtras(newValue) {
    setExtras(newValue);
    handleStuff(primaryIntent, frequency, newValue, howLong, repeat, whenSpent);
  }

  function handleOnChangeHowLong(newValue) {
    setHowLong(newValue);
    handleStuff(primaryIntent, frequency, extras, newValue, repeat, whenSpent);
  }

  function handleOnChangeRepeat(newValue) {
    setRepeat(newValue);
    handleStuff(primaryIntent, frequency, extras, howLong, newValue, whenSpent);
  }

  function handleOnChangeWhenSpent(newValue) {
    setWhenSpent(newValue);
    handleStuff(primaryIntent, frequency, extras, howLong, repeat, newValue);
  }

  function handleStuff(newPrimaryIntent, newFrequency, newExtras, newHowLong, newRepeat, newWhenSpent) {

    if (newPrimaryIntent === 'save' && (newFrequency === 'every_month' || newFrequency === 'every_week' || newFrequency === 'every_2_weeks') && newHowLong === 'no_matter_the_balance') {
      setOrder(["I want to", "_primaryIntent", "$50", "_frequency", "until I", "_howLong", "."]);
    } else if (newPrimaryIntent === 'save' && newFrequency === 'by') {
      setOrder(["I want to", "_primaryIntent", "$50", "_frequency", "June 2024. I plan to spend this money", "_whenSpent", ". Repeat this goal", "_repeat", "."]);
    } else if (newPrimaryIntent === 'save' && newHowLong === 'until_I_save_up_to') {
      setOrder(["I want to", "_primaryIntent", "$50", "_frequency", "until I ", "_howLong", "$300", "."]);
    } else if (newPrimaryIntent === 'be_able_to_spend') {
      setOrder(["I", "want", "to", "_primaryIntent", "$50", "available", "and", "_extras", "any", "extra", "balance", "that", "may", "have", "accumulated."]);
    }

    let newOrderList = [];

    order.forEach((item, index) => {
      if (item === '_primaryIntent') {
        newOrderList.push(<Select options={primaryIntentList} value={primaryIntent} onChange={newValue => handleOnChangePrimaryIntent(newValue)}/>);
      } else if (item === '_frequency') {
        newOrderList.push(<Select options={frequencyList} value={frequency} onChange={newValue => handleOnChangeFrequency(newValue)}/>);
      } else if (item === '_extras') {
        newOrderList.push(<Select options={extrasList} value={extras} onChange={newValue => handleOnChangeExtras(newValue)}/>);
      } else if (item === '_howLong') {
        newOrderList.push(<Select options={howLongList} value={howLong} onChange={newValue => handleOnChangeHowLong(newValue)}/>);
      } else if (item === '_repeat') {
        newOrderList.push(<Select options={repeatList} value={repeat} onChange={newValue => handleOnChangeRepeat(newValue)}/>);
      } else if (item === '_whenSpent') {
        newOrderList.push(<Select options={whenSpentList} value={whenSpent} onChange={newValue => handleOnChangeWhenSpent(newValue)}/>);
      } else {
        newOrderList.push(<View>{item}</View>);
      }
    });

    orderList = newOrderList;
  }

//Flavor text below. Look at you. This looks great. People use this for things like groceries, etc.
//And then use Groceries as a key word to start them with a different one.

// Still getting weird states sometimes... not sure how to render this all more properly for react world.

  return (
    <Tooltip position={position} onClose={() => onClose(notes)}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 5,
          padding: '10px',
        }}
      >
        <>
        {orderList}
        </>
      </View>
    </Tooltip>
  );
}

type TemplateButtonProps = {
  id: string;
  width?: number;
  height?: number;
  defaultColor?: string;
  tooltipPosition?: TooltipPosition;
  style?: CSSProperties;
};
export function TemplateButton({
  id,
  width = 12,
  height = 12,
  defaultColor = theme.buttonNormalText,
  tooltipPosition,
  style,
}: NotesButtonProps) {
  const [hover, setHover] = useState(false);
  const tooltip = useTooltip();
  const data = useLiveQuery(() => q('notes').filter({ id }).select('*'), [id]);
  const note = data && data.length > 0 ? data[0].note : null;
  const hasNotes = note && note !== '';

  function onClose(notes) {
    send('notes-save', { id, note: notes });
    tooltip.close();
  }

  const [delayHandler, setDelayHandler] = useState(null);

  const handleMouseEnter = () => {
    setDelayHandler(
      setTimeout(() => {
        setHover(true);
      }, 300),
    );
  };

  const handleMouseLeave = () => {
    clearTimeout(delayHandler);
    setHover(false);
  };

  // This account for both the tooltip hover, and editing tooltip
  const tooltipOpen = tooltip.isOpen || (hasNotes && hover);

  return (
    <View
      style={{ flexShrink: 0 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        type="bare"
        aria-label="View notes"
        className={!hasNotes && !tooltipOpen ? 'hover-visible' : ''}
        style={{
          color: defaultColor,
          ...style,
          ...(hasNotes && { display: 'flex !important' }),
          ...(tooltipOpen && { color: theme.buttonNormalText }),
        }}
        {...tooltip.getOpenEvents()}
      >
        <SvgTarget style={{ width, height }} />
      </Button>
      {tooltipOpen && (
        <NotesTooltip
          editable={tooltip.isOpen}
          defaultNotes={note}
          position={tooltipPosition}
          onClose={onClose}
        />
      )}
    </View>
  );
}
