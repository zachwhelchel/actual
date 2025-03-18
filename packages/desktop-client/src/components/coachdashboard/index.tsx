import React, { useState, useEffect } from 'react';
import { styles, theme, type CSSProperties } from '../../style';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Select } from '../common/Select';
import { View } from '../common/View';
import { Text } from '../common/Text';
import { SimpleTable } from '../common/SimpleTable';
import { send } from 'loot-core/platform/client/fetch';
import { Client } from 'loot-core/src/types/client';

export function CoachDashboard() {
  const [clientList, setClientList] = useState<Client[]>([]);

  const headers = [
    { title: 'Client Name', width: 200 },
    { title: 'Status', width: 150 },
    { title: 'Status Expires At', width: 200 },
  ];

  const getClients = async () => {
    try {
      const results = await send('airtable-clients');
      if (results.error_code) {
        throw new Error(results.reason);
      }
      setClientList(results.clients || []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  return (
    <View style={{ marginTop: 20 }}>
      <div
        key="underConstruction"
        style={{
          backgroundColor: theme.warningBackground,
          color: theme.warningText,
          padding: '10px',
          textAlign: 'center',
        }}
      >
        This dashboard is still under construction. These numbers are examples
        only!
      </div>
      <Text style={styles.mediumText}>Client List</Text>
      <View style={{ marginTop: 10 }}>
        <SimpleTable>
          <tr>
            {headers.map((header, index) => (
              <th key={index} style={{ width: header.width }}>
                {header.title}
              </th>
            ))}
          </tr>
          {clientList.map((client, index) => (
            <tr key={index}>
              <td>{client.name}</td>
              <td>{client.status}</td>
              <td>{client.statusExpiresAt}</td>
            </tr>
          ))}
        </SimpleTable>
      </View>
      <View
        key={"needHelpDiscordLink"}
        style={{
          marginTop: 15,
          marginLeft: 5,
          flex: '0 0 auto',
          flexDirection: 'row',
        }}
      >
        Need help? Reach out anytime on Discord.
      </View>
    </View>
  );
}
