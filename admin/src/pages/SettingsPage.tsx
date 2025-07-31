import * as React from 'react'
import { Page, useNotification, useFetchClient, Layouts } from '@strapi/admin/strapi-admin'
import {
  Box,
  Button,
  Flex,
  Grid,
  TextInput,
  Typography,
  Field,
  Loader,
} from '@strapi/design-system'
import { Check } from '@strapi/icons'
import { useIntl } from 'react-intl'

import { getTranslation } from '../utils/getTranslation'

interface PirschSettings {
  pirschUrl: string
}

export const ProtectedSettingsPage = () => <SettingsPage />

const SettingsPage = () => {
  const { toggleNotification } = useNotification()
  const { formatMessage } = useIntl()
  const { get, put } = useFetchClient()

  const [pirschUrl, setPirschUrl] = React.useState('')

  const [data, setData] = React.useState<PirschSettings | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await get<{ data: PirschSettings }>('/pirsch/settings')
        const settings = res.data.data
        setData(settings)
        setPirschUrl(settings?.pirschUrl || '')
      } catch (error) {
        console.error('Failed to fetch settings:', error)
        toggleNotification!({
          type: 'danger',
          message: formatMessage({ id: getTranslation('notification.error') }),
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [get, toggleNotification, formatMessage])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPirschUrl(event.target.value)
  }

  const handleClear = async () => {
    setIsSaving(true)

    try {
      await put('/pirsch/settings', { pirschUrl: '' })
      setPirschUrl('')
      setData({ pirschUrl: '' })
      toggleNotification!({
        type: 'success',
        message: formatMessage({ id: getTranslation('notification.success') }),
      })
    } catch (error) {
      console.error('Failed to clear settings:', error)
      toggleNotification!({
        type: 'danger',
        message: formatMessage({ id: getTranslation('notification.error') }),
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      await put('/pirsch/settings', { pirschUrl })
      setData({ pirschUrl })
      toggleNotification!({
        type: 'success',
        message: formatMessage({ id: getTranslation('notification.success') }),
      })
    } catch (error) {
      console.error('Failed to save settings:', error)
      toggleNotification!({
        type: 'danger',
        message: formatMessage({ id: getTranslation('notification.error') }),
      })
    } finally {
      setIsSaving(false)
    }
  }

  const isValidUrl = (url: string) => {
    if (!url.trim()) return true // Allow empty
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const canSave = isValidUrl(pirschUrl)

  if (isLoading) {
    return (
      <Page.Main>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
          }}
        >
          <Loader>Loading settings...</Loader>
        </div>
      </Page.Main>
    )
  }

  return (
    <Page.Main aria-busy={isLoading || isSaving}>
      <Page.Title>
        {formatMessage(
          { id: 'Settings.PageTitle', defaultMessage: 'Settings - {name}' },
          {
            name: formatMessage({
              id: getTranslation('settings.title'),
            }),
          },
        )}
      </Page.Title>
      <Layouts.Header
        id='title'
        title={formatMessage({
          id: getTranslation('settings.title'),
        })}
        subtitle={formatMessage({
          id: getTranslation('settings.section.description'),
        })}
      />

      <Layouts.Content>
        {data && (
          <form onSubmit={handleSubmit}>
            <Flex direction='column' alignItems='stretch' gap={7}>
              <Box
                background='neutral0'
                hasRadius
                shadow='filterShadow'
                paddingTop={6}
                paddingBottom={6}
                paddingLeft={7}
                paddingRight={7}
              >
                <Flex direction='column' alignItems='stretch' gap={4}>
                  <Flex direction='column' alignItems='stretch' gap={1}>
                    <Typography variant='delta' tag='h2'>
                      {formatMessage({
                        id: getTranslation('settings.configuration.title'),
                      })}
                    </Typography>
                    <Typography>
                      {formatMessage({
                        id: getTranslation('settings.configuration.description'),
                      })}
                    </Typography>
                  </Flex>

                  <Grid.Root gap={5}>
                    <Grid.Item col={6} s={12} direction='column' alignItems='stretch'>
                      <Field.Root name='current-pirsch-url'>
                        <Field.Label>
                          {formatMessage({
                            id: getTranslation('settings.current.label'),
                          })}
                        </Field.Label>
                        <TextInput
                          disabled
                          value={
                            data.pirschUrl ||
                            formatMessage({ id: getTranslation('settings.current.empty') })
                          }
                        />
                      </Field.Root>
                    </Grid.Item>
                  </Grid.Root>
                </Flex>
              </Box>

              <Flex
                alignItems='stretch'
                background='neutral0'
                direction='column'
                gap={4}
                hasRadius
                shadow='filterShadow'
                paddingTop={6}
                paddingBottom={6}
                paddingLeft={7}
                paddingRight={7}
              >
                <Typography variant='delta' tag='h2'>
                  {formatMessage({
                    id: getTranslation('settings.update.title'),
                  })}
                </Typography>

                <Grid.Root gap={5}>
                  <Grid.Item col={6} s={12} direction='column' alignItems='stretch'>
                    <Field.Root
                      name='pirsch-url'
                      error={
                        pirschUrl && !isValidUrl(pirschUrl)
                          ? formatMessage({ id: getTranslation('settings.pirschUrl.error') })
                          : undefined
                      }
                    >
                      <Field.Label>
                        {formatMessage({
                          id: getTranslation('settings.pirschUrl.label'),
                        })}
                      </Field.Label>
                      <TextInput
                        onChange={handleChange}
                        value={pirschUrl}
                        placeholder={formatMessage({
                          id: getTranslation('settings.pirschUrl.placeholder'),
                        })}
                      />
                      <Field.Hint>
                        {formatMessage({
                          id: getTranslation('settings.pirschUrl.hint'),
                        })}
                      </Field.Hint>
                      <Field.Error />
                    </Field.Root>

                    <Flex gap={2} marginTop={4}>
                      <Button
                        loading={isSaving}
                        disabled={!canSave}
                        type='submit'
                        startIcon={<Check />}
                      >
                        {formatMessage({
                          id: getTranslation('settings.save'),
                        })}
                      </Button>
                      <Button
                        variant='secondary'
                        disabled={!pirschUrl.trim() || isSaving}
                        loading={isSaving}
                        onClick={handleClear}
                      >
                        Clear
                      </Button>
                    </Flex>
                  </Grid.Item>
                </Grid.Root>
              </Flex>
            </Flex>
          </form>
        )}
      </Layouts.Content>
    </Page.Main>
  )
}

export { SettingsPage }
