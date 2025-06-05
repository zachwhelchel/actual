import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { send } from 'loot-core/platform/client/fetch';
import { type Client } from 'loot-core/src/types/client';
import { clientFactory } from 'loot-core/src/types/factories/clientFactory';
import { styles, theme } from '../../style';
import { Button } from '../common/Button2';
import { Input } from '../common/Input';
import { Text } from '../common/Text';
import { View } from '../common/View';
import { SvgCheveronOutlineLeft } from '../../icons/v1';

interface ClientDetailPageProps {
  client?: Client | null; // Pass the full client object instead of just ID
  onBack: () => void;
  onSave: () => void;
}

export function ClientDetailPage({
  client: passedClient,
  onBack,
  onSave,
}: ClientDetailPageProps) {
  const dispatch = useDispatch();
  const [client, setClient] = useState<Client | null>(passedClient || null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    name: '', // Keep for external clients
    email: '',
    phone: '',
    notes: '',
    status: 'external_client', // Default status for new external clients
    nextMeetingDate: '', // Add this new field
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Helper to determine if client is external
  const isExternalClient = (client: Client | null) => {
    return client?.status === 'external_client' || client?.status === 'lead';
  };

  // Helper to determine what fields can be edited
  const canEditField = (fieldName: string, client: Client | null) => {
    if (!client) return true; // New clients can edit all fields
    if (fieldName === 'notes') return true; // Notes always editable
    return isExternalClient(client); // Other fields only editable for external clients
  };

  const formStyles = {
    container: {
      width: '80%',
      margin: '0 auto',
      padding: 20,
      minHeight: '100vh',
      overflowY: 'auto',
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 30,
      gap: 12,
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: 6, // Add spacing between icon and text
      padding: '8px 12px',
      backgroundColor: 'transparent',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: 14,
      ':hover': {
        backgroundColor: '#f9fafb',
      },
    },
    title: {
      fontSize: 24,
      fontWeight: 600,
      color: '#111827',
      margin: 0,
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 20,
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 6,
    },
    label: {
      fontSize: 14,
      fontWeight: 500,
      color: '#374151',
    },
    input: {
      padding: '10px 12px',
      fontSize: 14,
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      backgroundColor: '#fff',
      ':focus': {
        outline: 'none',
        borderColor: theme.buttonPrimaryBackground,
        boxShadow: `0 0 0 3px ${theme.buttonPrimaryBackground}20`,
      },
    },
    textarea: {
      padding: '10px 12px',
      fontSize: 14,
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      backgroundColor: '#fff',
      minHeight: 100,
      resize: 'vertical' as const,
      fontFamily: 'inherit',
      ':focus': {
        outline: 'none',
        borderColor: theme.buttonPrimaryBackground,
        boxShadow: `0 0 0 3px ${theme.buttonPrimaryBackground}20`,
      },
    },
    buttonGroup: {
      display: 'flex',
      gap: 12,
      justifyContent: 'flex-end',
      marginTop: 30,
    },
    infoSection: {
      backgroundColor: '#f9fafb',
      padding: 20,
      borderRadius: 8,
      marginBottom: 20,
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
    },
    infoItem: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 4,
    },
    infoLabel: {
      fontSize: 12,
      fontWeight: 500,
      color: '#6b7280',
      textTransform: 'uppercase' as const,
    },
    infoValue: {
      fontSize: 14,
      color: '#111827',
    },
    errorText: {
      fontSize: 12,
      color: '#dc2626',
      marginTop: 4,
    },
    deleteButton: {
      padding: '8px 16px',
      backgroundColor: '#dc2626',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: 14,
      ':hover': {
        backgroundColor: '#b91c1c',
      },
    },
    deleteConfirmOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    deleteConfirmModal: {
      backgroundColor: '#fff',
      padding: 24,
      borderRadius: 8,
      maxWidth: 400,
      width: '90%',
      boxShadow:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    deleteConfirmTitle: {
      fontSize: 18,
      fontWeight: 600,
      color: '#111827',
      marginBottom: 12,
    },
    deleteConfirmText: {
      fontSize: 14,
      color: '#6b7280',
      marginBottom: 20,
      lineHeight: 1.5,
    },
    deleteConfirmButtons: {
      display: 'flex',
      gap: 12,
      justifyContent: 'flex-end',
    },
  };

  const formatDateTimeLocal = dateString => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      // Convert to local timezone and format as YYYY-MM-DDTHH:mm
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      return '';
    }
  };

  useEffect(() => {
    if (passedClient) {
      setClient(passedClient);

      // Split name into first and last for external clients
      let firstName = '';
      let lastName = '';
      if (isExternalClient(passedClient) && passedClient.name) {
        const nameParts = passedClient.name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }

      console.log('nextMeetingDate');
      console.log(passedClient.nextMeetingDate);

      setFormData({
        firstName: firstName,
        lastName: lastName,
        name: !isExternalClient(passedClient) ? passedClient.name || '' : '',
        email: passedClient.email || '',
        phone: passedClient.phone || '',
        notes: passedClient.coachNotes || '',
        status: passedClient.status || 'external_client',
        nextMeetingDate: formatDateTimeLocal(passedClient.nextMeetingDate), // Format the date
      });
    }
  }, [passedClient]);

  const convertToUTC = localDateTime => {
    if (!localDateTime) return null;
    try {
      // Create date object from local datetime input
      const localDate = new Date(localDateTime);
      // This automatically converts to UTC when you call toISOString()
      return localDate.toISOString();
    } catch (error) {
      return null;
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (isExternalClient(client) || !passedClient) {
      // External clients and new clients (assume external by default)
      if (!formData.firstName.trim()) {
        errors.push('First name is required');
      }
      if (!formData.lastName.trim()) {
        errors.push('Last name is required');
      }
    } else {
      // Internal clients
      if (!formData.name.trim()) {
        errors.push('Name is required');
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasUnsavedChanges(true);

    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave without saving?',
      );
      if (!confirmLeave) {
        return;
      }
    }
    onBack();
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // Combine first and last name for external clients
      const clientData = { ...formData };
      if (isExternalClient(client) || !passedClient) {
        // For external clients or new clients
        clientData.name =
          `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();
      }

      // TODO: Implement save logic to your backend
      // This would typically be a call to send('save-client', { client, ...clientData })
      console.log('Saving client:', { client, ...clientData });

      if (!passedClient) {
        //new

        console.log(passedClient);

        const url = String(window.location.href);
        const results = await send('airtable-create-client', {
          url,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          coachNotes: formData.notes,
          nextMeetingDate: convertToUTC(formData.nextMeetingDate), // Convert to UTC
        });
        console.log('airtable-update-internal-client');
        console.log(results);
      } else if (isExternalClient(client)) {
        //external save
        console.log(passedClient);

        const url = String(window.location.href);
        const results = await send('airtable-update-external-client', {
          url,
          clientId: passedClient.recordId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          coachNotes: formData.notes,
          nextMeetingDate: convertToUTC(formData.nextMeetingDate), // Convert to UTC
        });
        console.log('airtable-update-internal-client');
        console.log(results);
      } else {
        //internal save

        console.log(passedClient);

        const url = String(window.location.href);
        const results = await send('airtable-update-internal-client', {
          url,
          clientId: passedClient.recordId,
          coachNotes: formData.notes,
          nextMeetingDate: convertToUTC(formData.nextMeetingDate), // Convert to UTC
        });
        console.log('airtable-update-internal-client');
        console.log(results);
      }

      // Simulate API call
      //await new Promise(resolve => setTimeout(resolve, 1000));

      setHasUnsavedChanges(false);
      onSave();
      onBack(); // Always go back after saving
    } catch (error) {
      console.error('Failed to save client:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // TODO: Implement delete logic to your backend
      // This would typically be a call to send('delete-client', { clientId: client.userId })
      console.log('Deleting client:', client);

      const url = String(window.location.href);
      const results = await send('airtable-delete-external-client', {
        url,
        clientId: passedClient.recordId,
      });
      console.log('airtable-update-internal-client');
      console.log(results);

      // Simulate API call
      //await new Promise(resolve => setTimeout(resolve, 1000));

      onSave(); // Refresh the list
      onBack(); // Go back to list
    } catch (error) {
      console.error('Failed to delete client:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const getNormalizedStatusText = (status: string): string => {
    if (!status) return 'Unknown';

    const normalizedStatus = status.toLowerCase();

    const statusMap: Record<string, string> = {
      free_trial: 'Free Trial',
      free_trial_expired: 'Trial Expired',
      paid: 'Paid User',
      paid_expired: 'Expired Paid',
      sponsored: 'Sponsored',
      sponsored_expired: 'Expired Sponsored',
      coach_account: 'Coach',
      coach_account_expired: 'Expired Coach',
      external_client: 'Non-MBC Client',
      lead: 'Lead',
      server_specific: 'Unknown',
    };

    return (
      statusMap[normalizedStatus] ||
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    );
  };

  return (
    <div style={{ height: '100vh', overflowY: 'auto', padding: 0 }}>
      <View style={formStyles.container}>
        <View style={formStyles.header}>
          <Button
            variant="bare"
            onClick={handleBack}
            style={formStyles.backButton}
          >
            <SvgCheveronOutlineLeft width={16} height={16} />
            Back
          </Button>
          <Text style={formStyles.title}>
            {passedClient
              ? `Edit ${client?.name || 'Client'}`
              : 'Add New Client'}
          </Text>
        </View>

        {client && (
          <View style={formStyles.infoSection}>
            <View style={formStyles.infoGrid}>
              <View style={formStyles.infoItem}>
                <Text style={formStyles.infoLabel}>Status</Text>
                <Text style={formStyles.infoValue}>
                  {getNormalizedStatusText(client.status)}
                </Text>
              </View>
              <View style={formStyles.infoItem}>
                <Text style={formStyles.infoLabel}>Joined</Text>
                <Text style={formStyles.infoValue}>
                  {formatDate(client.joinedAt)}
                </Text>
              </View>
              <View style={formStyles.infoItem}>
                <Text style={formStyles.infoLabel}>Status Expires</Text>
                <Text style={formStyles.infoValue}>
                  {formatDate(client.statusExpiresAt)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {validationErrors.length > 0 && (
          <View
            style={{
              marginBottom: 20,
              padding: 12,
              backgroundColor: '#fef2f2',
              borderRadius: 6,
              border: '1px solid #fecaca',
            }}
          >
            {validationErrors.map((error, index) => (
              <Text key={index} style={formStyles.errorText}>
                {error}
              </Text>
            ))}
          </View>
        )}

        <View style={formStyles.form}>
          {/* Name fields - different for internal vs external clients */}
          {isExternalClient(client) || !passedClient ? (
            // External clients or new clients - first and last name fields
            <>
              <View style={formStyles.formGroup}>
                <Text style={formStyles.label}>First Name *</Text>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={e => handleInputChange('firstName', e.target.value)}
                  style={formStyles.input}
                  placeholder="Enter first name"
                />
              </View>

              <View style={formStyles.formGroup}>
                <Text style={formStyles.label}>Last Name *</Text>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={e => handleInputChange('lastName', e.target.value)}
                  style={formStyles.input}
                  placeholder="Enter last name"
                />
              </View>
            </>
          ) : (
            // Internal clients - single name field (read-only)
            <View style={formStyles.formGroup}>
              <Text style={formStyles.label}>Name</Text>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                style={{
                  ...formStyles.input,
                  backgroundColor: !canEditField('name', client)
                    ? '#f3f4f6'
                    : '#fff',
                }}
                disabled={!canEditField('name', client)}
                placeholder="Enter client name"
              />
              {!canEditField('name', client) && client && (
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                  Name cannot be edited for MyBudgetCoach users.
                </Text>
              )}
            </View>
          )}

          <View style={formStyles.formGroup}>
            <Text style={formStyles.label}>Email</Text>
            <input
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              style={{
                ...formStyles.input,
                backgroundColor: !canEditField('email', client)
                  ? '#f3f4f6'
                  : '#fff',
              }}
              disabled={!canEditField('email', client)}
              placeholder="Enter email address"
            />
            {!canEditField('email', client) && client && (
              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                Email cannot be edited for MyBudgetCoach users.
              </Text>
            )}
          </View>

          <View style={formStyles.formGroup}>
            <Text style={formStyles.label}>Phone</Text>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              style={{
                ...formStyles.input,
                backgroundColor: !canEditField('phone', client)
                  ? '#f3f4f6'
                  : '#fff',
              }}
              disabled={!canEditField('phone', client)}
              placeholder="Enter phone number"
            />
            {!canEditField('phone', client) && client && (
              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                Phone cannot be edited for MyBudgetCoach users.
              </Text>
            )}
          </View>

          {/* Status dropdown for external clients */}
          {(isExternalClient(client) || !passedClient) && (
            <View style={formStyles.formGroup}>
              <Text style={formStyles.label}>Status *</Text>
              <select
                value={formData.status}
                onChange={e => handleInputChange('status', e.target.value)}
                style={formStyles.input}
              >
                <option value="external_client">Non-MBC Client</option>
                <option value="lead">Lead</option>
              </select>
            </View>
          )}

          <View style={formStyles.formGroup}>
            <Text style={formStyles.label}>Notes</Text>
            <textarea
              value={formData.notes}
              onChange={e => handleInputChange('notes', e.target.value)}
              style={formStyles.textarea}
              disabled={false}
              placeholder="Add any notes about this client"
            />
          </View>

          <View style={formStyles.formGroup}>
            <Text style={formStyles.label}>Next Meeting Date</Text>
            <input
              type="datetime-local"
              value={formData.nextMeetingDate}
              onChange={e =>
                handleInputChange('nextMeetingDate', e.target.value)
              }
              style={formStyles.input}
              placeholder="Select next meeting date and time"
            />
          </View>
        </View>

        <View style={formStyles.buttonGroup}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 12,
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {/* Delete button for external clients */}
            {isExternalClient(client) && passedClient && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={formStyles.deleteButton}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Client'}
              </button>
            )}

            <Button
              variant="primary"
              onClick={handleSave}
              disabled={
                isSaving ||
                (isExternalClient(client) || !passedClient
                  ? !formData.firstName.trim() || !formData.lastName.trim()
                  : !formData.name.trim())
              }
            >
              {isSaving
                ? 'Saving...'
                : passedClient
                  ? 'Save Changes'
                  : 'Save Client'}
            </Button>
          </View>
        </View>

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div style={formStyles.deleteConfirmOverlay}>
            <div style={formStyles.deleteConfirmModal}>
              <h3 style={formStyles.deleteConfirmTitle}>Delete Client</h3>
              <p style={formStyles.deleteConfirmText}>
                Are you sure you want to delete "{client?.name}"? This action
                cannot be undone.
              </p>
              <div style={formStyles.deleteConfirmButtons}>
                <Button
                  variant="bare"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <button
                  onClick={handleDelete}
                  style={formStyles.deleteButton}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </View>
    </div>
  );
}
