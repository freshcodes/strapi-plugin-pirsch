import { useState, useEffect } from 'react'
import { Main, Typography, Alert, Loader } from '@strapi/design-system'
import { useIntl } from 'react-intl'
import { useFetchClient } from '@strapi/admin/strapi-admin'

import { getTranslation } from '../utils/getTranslation'

const HomePage = () => {
  const { formatMessage } = useIntl()
  const { get } = useFetchClient()

  const [pirschUrl, setPirschUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data } = await get('/pirsch/dashboard')
      setPirschUrl(data.data?.pirschUrl || '')
    } catch (err) {
      console.error('Failed to load dashboard settings:', err)
      setError('Failed to load dashboard settings')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Main>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '40px 24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <Loader>Loading dashboard...</Loader>
        </div>
      </Main>
    )
  }

  if (error) {
    return (
      <Main>
        <div
          style={{
            maxWidth: '1280px',
            padding: '40px 24px',
            margin: '0 auto',
            textAlign: 'center',
            marginTop: '100px',
          }}
        >
          <Typography variant='alpha' fontWeight='bold' textColor='neutral800' marginBottom={2}>
            {formatMessage({ id: getTranslation('plugin.name') })}
          </Typography>
          <div style={{ marginBottom: '24px' }}>
            <Alert variant='danger' title={error} />
          </div>
        </div>
      </Main>
    )
  }

  if (!pirschUrl || !pirschUrl.trim()) {
    return (
      <Main>
        <div
          style={{
            padding: '24px',
          }}
        >
          <Typography variant='alpha' fontWeight='bold' textColor='neutral800' marginBottom={2}>
            {formatMessage({ id: getTranslation('plugin.name') })}
          </Typography>
          <div>
            <Typography variant='epsilon' textColor='neutral600'>
              {formatMessage({ id: getTranslation('dashboard.not-configured') })}
            </Typography>
          </div>
        </div>
      </Main>
    )
  }

  return (
    <iframe
      src={pirschUrl}
      style={{
        width: '100%',
        height: '100vh',
        marginBottom: '-0.5rem',
        border: 'none',
      }}
      title='Pirsch Analytics Dashboard'
      sandbox='allow-scripts allow-same-origin allow-forms'
    />
  )
}

export { HomePage }
