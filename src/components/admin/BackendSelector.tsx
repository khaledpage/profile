'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/utils/i18n';
import type { SiteConfig } from '@/types/content';
import { BackendType, BackendConfig, BackendSettings } from '@/services/backendConfigManager';

type Props = {
  config: SiteConfig;
  onBackendChange?: (backend: BackendSettings) => void;
};

export default function BackendSelector({ config, onBackendChange }: Props) {
  const { translations } = useLanguage(config);
  const [currentBackend, setCurrentBackend] = useState<BackendType>('filesystem');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [backendConfig, setBackendConfig] = useState<BackendSettings>({
    primary: {
      type: 'filesystem',
      filesystem: {
        articlesPath: './src/content/articles',
        assetsPath: './public/data/articles'
      }
    },
    syncEnabled: false
  });

  const [testResults, setTestResults] = useState<{
    [key: string]: 'idle' | 'testing' | 'success' | 'error';
  }>({});

  useEffect(() => {
    // Load saved backend configuration
    const savedConfig = localStorage.getItem('article-backend-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setBackendConfig(parsed);
        setCurrentBackend(parsed.primary.type);
      } catch (error) {
        console.error('Failed to parse saved backend config:', error);
      }
    }
  }, []);

  const handleBackendTypeChange = (type: BackendType) => {
    setCurrentBackend(type);
    setBackendConfig(prev => ({
      ...prev,
      primary: {
        ...prev.primary,
        type
      }
    }));
  };

  const handleConfigSave = () => {
    // Validate required fields based on backend type
    if (currentBackend === 'database') {
      const dbConfig = backendConfig.primary.database;
      if (!dbConfig?.host || !dbConfig?.database) {
        // Show validation error - don't close panel
        return;
      }
    } else if (currentBackend === 'cms') {
      const cmsConfig = backendConfig.primary.cms;
      if (!cmsConfig?.apiUrl || !cmsConfig?.apiKey) {
        // Show validation error - don't close panel
        return;
      }
    }

    localStorage.setItem('article-backend-config', JSON.stringify(backendConfig));
    onBackendChange?.(backendConfig);
    setIsConfiguring(false);
  };

  const testConnection = async (backendType: BackendType) => {
    setTestResults(prev => ({ ...prev, [backendType]: 'testing' }));
    
    try {
      // Mock API call to test connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, randomly succeed or fail
      const success = Math.random() > 0.3;
      
      setTestResults(prev => ({ 
        ...prev, 
        [backendType]: success ? 'success' : 'error' 
      }));
    } catch (error) {
      setTestResults(prev => ({ ...prev, [backendType]: 'error' }));
    }
  };

  const renderDatabaseConfig = () => (
    <div id="database-config-section" className="space-y-4">
      <div id="database-type-selector">
        <label htmlFor="database-type" className="block text-sm font-medium mb-2">
          {translations?.admin?.backendSelector?.databaseType || 'Database Type'}
        </label>
        <select
          id="database-type"
          className="w-full p-2 border rounded-md bg-background"
          value={backendConfig.primary.database?.type || 'postgresql'}
          onChange={(e) => setBackendConfig(prev => ({
            ...prev,
            primary: {
              ...prev.primary,
              database: {
                ...prev.primary.database,
                type: e.target.value as 'postgresql' | 'mysql' | 'sqlite',
                database: prev.primary.database?.database || 'articles_db'
              }
            }
          }))}
        >
          <option value="postgresql">PostgreSQL</option>
          <option value="mysql">MySQL</option>
          <option value="sqlite">SQLite</option>
        </select>
      </div>

      {backendConfig.primary.database?.type !== 'sqlite' && (
        <div id="database-connection-fields" className="grid grid-cols-2 gap-4">
          <div id="database-host-field">
            <label htmlFor="database-host" className="block text-sm font-medium mb-2">
              {translations?.admin?.backendSelector?.host || 'Host'}
            </label>
            <input
              id="database-host"
              type="text"
              className="w-full p-2 border rounded-md bg-background"
              placeholder="localhost"
              value={backendConfig.primary.database?.host || ''}
              onChange={(e) => setBackendConfig(prev => ({
                ...prev,
                primary: {
                  ...prev.primary,
                  database: {
                    ...prev.primary.database,
                    host: e.target.value,
                    type: prev.primary.database?.type || 'postgresql',
                    database: prev.primary.database?.database || 'articles_db'
                  }
                }
              }))}
            />
          </div>

          <div id="database-port-field">
            <label htmlFor="database-port" className="block text-sm font-medium mb-2">
              {translations?.admin?.backendSelector?.port || 'Port'}
            </label>
            <input
              id="database-port"
              type="number"
              className="w-full p-2 border rounded-md bg-background"
              placeholder="5432"
              value={backendConfig.primary.database?.port || ''}
              onChange={(e) => setBackendConfig(prev => ({
                ...prev,
                primary: {
                  ...prev.primary,
                  database: {
                    ...prev.primary.database,
                    port: parseInt(e.target.value) || 5432,
                    type: prev.primary.database?.type || 'postgresql',
                    database: prev.primary.database?.database || 'articles_db'
                  }
                }
              }))}
            />
          </div>

          <div id="database-name-field">
            <label htmlFor="database-name" className="block text-sm font-medium mb-2">
              {translations?.admin?.backendSelector?.database || 'Database'}
            </label>
            <input
              id="database-name"
              type="text"
              className="w-full p-2 border rounded-md bg-background"
              placeholder="articles_db"
              value={backendConfig.primary.database?.database || ''}
              onChange={(e) => setBackendConfig(prev => ({
                ...prev,
                primary: {
                  ...prev.primary,
                  database: {
                    ...prev.primary.database,
                    database: e.target.value,
                    type: prev.primary.database?.type || 'postgresql'
                  }
                }
              }))}
            />
          </div>

          <div id="database-username-field">
            <label htmlFor="database-username" className="block text-sm font-medium mb-2">
              {translations?.admin?.backendSelector?.username || 'Username'}
            </label>
            <input
              id="database-username"
              type="text"
              className="w-full p-2 border rounded-md bg-background"
              value={backendConfig.primary.database?.username || ''}
              onChange={(e) => setBackendConfig(prev => ({
                ...prev,
                primary: {
                  ...prev.primary,
                  database: {
                    ...prev.primary.database,
                    username: e.target.value,
                    type: prev.primary.database?.type || 'postgresql',
                    database: prev.primary.database?.database || 'articles_db'
                  }
                }
              }))}
            />
          </div>
        </div>
      )}

      {backendConfig.primary.database?.type === 'sqlite' && (
        <div id="sqlite-filename-field">
          <label htmlFor="sqlite-filename" className="block text-sm font-medium mb-2">
            {translations?.admin?.backendSelector?.filename || 'Database File'}
          </label>
          <input
            id="sqlite-filename"
            type="text"
            className="w-full p-2 border rounded-md bg-background"
            placeholder="./data/articles.db"
            value={backendConfig.primary.database?.filename || ''}
            onChange={(e) => setBackendConfig(prev => ({
              ...prev,
              primary: {
                ...prev.primary,
                database: {
                  ...prev.primary.database,
                  filename: e.target.value,
                  type: 'sqlite',
                  database: 'articles'
                }
              }
            }))}
          />
        </div>
      )}
    </div>
  );

  const renderCMSConfig = () => (
    <div id="cms-config-section" className="space-y-4">
      <div id="cms-type-selector">
        <label htmlFor="cms-type" className="block text-sm font-medium mb-2">
          {translations?.admin?.backendSelector?.cmsType || 'CMS Type'}
        </label>
        <select
          id="cms-type"
          className="w-full p-2 border rounded-md bg-background"
          value={backendConfig.primary.cms?.type || 'strapi'}
          onChange={(e) => setBackendConfig(prev => ({
            ...prev,
            primary: {
              ...prev.primary,
              cms: {
                ...prev.primary.cms,
                type: e.target.value as 'strapi' | 'contentful' | 'sanity' | 'ghost' | 'custom',
                apiUrl: prev.primary.cms?.apiUrl || ''
              }
            }
          }))}
        >
          <option value="strapi">Strapi</option>
          <option value="contentful">Contentful</option>
          <option value="sanity">Sanity</option>
          <option value="ghost">Ghost</option>
          <option value="custom">Custom API</option>
        </select>
      </div>

      <div id="cms-api-url-field">
        <label htmlFor="cms-api-url" className="block text-sm font-medium mb-2">
          {translations?.admin?.backendSelector?.apiUrl || 'API URL'}
        </label>
        <input
          id="cms-api-url"
          type="url"
          className="w-full p-2 border rounded-md bg-background"
          placeholder="https://your-cms.example.com"
          value={backendConfig.primary.cms?.apiUrl || ''}
          onChange={(e) => setBackendConfig(prev => ({
            ...prev,
            primary: {
              ...prev.primary,
              cms: {
                ...prev.primary.cms,
                apiUrl: e.target.value,
                type: prev.primary.cms?.type || 'strapi'
              }
            }
          }))}
        />
      </div>

      <div id="cms-api-key-field">
        <label htmlFor="cms-api-key" className="block text-sm font-medium mb-2">
          {translations?.admin?.backendSelector?.apiKey || 'API Key'}
        </label>
        <input
          id="cms-api-key"
          type="password"
          className="w-full p-2 border rounded-md bg-background"
          value={backendConfig.primary.cms?.apiKey || ''}
          onChange={(e) => setBackendConfig(prev => ({
            ...prev,
            primary: {
              ...prev.primary,
              cms: {
                ...prev.primary.cms,
                apiKey: e.target.value,
                type: prev.primary.cms?.type || 'strapi',
                apiUrl: prev.primary.cms?.apiUrl || ''
              }
            }
          }))}
        />
      </div>

      {backendConfig.primary.cms?.type === 'contentful' && (
        <div id="contentful-config" className="grid grid-cols-2 gap-4">
          <div id="contentful-space-field">
            <label htmlFor="contentful-space" className="block text-sm font-medium mb-2">
              Space ID
            </label>
            <input
              id="contentful-space"
              type="text"
              className="w-full p-2 border rounded-md bg-background"
              value={backendConfig.primary.cms?.spaceId || ''}
              onChange={(e) => setBackendConfig(prev => ({
                ...prev,
                primary: {
                  ...prev.primary,
                  cms: {
                    ...prev.primary.cms,
                    spaceId: e.target.value,
                    type: 'contentful',
                    apiUrl: prev.primary.cms?.apiUrl || ''
                  }
                }
              }))}
            />
          </div>

          <div id="contentful-environment-field">
            <label htmlFor="contentful-environment" className="block text-sm font-medium mb-2">
              Environment
            </label>
            <input
              id="contentful-environment"
              type="text"
              className="w-full p-2 border rounded-md bg-background"
              placeholder="master"
              value={backendConfig.primary.cms?.environment || ''}
              onChange={(e) => setBackendConfig(prev => ({
                ...prev,
                primary: {
                  ...prev.primary,
                  cms: {
                    ...prev.primary.cms,
                    environment: e.target.value,
                    type: 'contentful',
                    apiUrl: prev.primary.cms?.apiUrl || ''
                  }
                }
              }))}
            />
          </div>
        </div>
      )}

      {backendConfig.primary.cms?.type === 'sanity' && (
        <div id="sanity-config" className="grid grid-cols-2 gap-4">
          <div id="sanity-project-field">
            <label htmlFor="sanity-project" className="block text-sm font-medium mb-2">
              Project ID
            </label>
            <input
              id="sanity-project"
              type="text"
              className="w-full p-2 border rounded-md bg-background"
              value={backendConfig.primary.cms?.projectId || ''}
              onChange={(e) => setBackendConfig(prev => ({
                ...prev,
                primary: {
                  ...prev.primary,
                  cms: {
                    ...prev.primary.cms,
                    projectId: e.target.value,
                    type: 'sanity',
                    apiUrl: prev.primary.cms?.apiUrl || ''
                  }
                }
              }))}
            />
          </div>

          <div id="sanity-dataset-field">
            <label htmlFor="sanity-dataset" className="block text-sm font-medium mb-2">
              Dataset
            </label>
            <input
              id="sanity-dataset"
              type="text"
              className="w-full p-2 border rounded-md bg-background"
              placeholder="production"
              value={backendConfig.primary.cms?.dataset || ''}
              onChange={(e) => setBackendConfig(prev => ({
                ...prev,
                primary: {
                  ...prev.primary,
                  cms: {
                    ...prev.primary.cms,
                    dataset: e.target.value,
                    type: 'sanity',
                    apiUrl: prev.primary.cms?.apiUrl || ''
                  }
                }
              }))}
            />
          </div>
        </div>
      )}
    </div>
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'testing':
        return <div className="w-4 h-4 animate-spin border-2 border-blue-500 border-t-transparent rounded-full" />;
      case 'success':
        return <div className="w-4 h-4 bg-green-500 rounded-full" />;
      case 'error':
        return <div className="w-4 h-4 bg-red-500 rounded-full" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  return (
    <div id="backend-selector-container" className="p-6 glass rounded-lg">
      <div id="backend-selector-header" className="flex items-center justify-between mb-6">
        <h2 id="backend-selector-title" className="text-2xl font-bold">
          {translations?.admin?.backendSelector?.title || 'Article Backend Configuration'}
        </h2>
        <button
          id="backend-configure-button"
          onClick={() => setIsConfiguring(!isConfiguring)}
          className="px-4 py-2 bg-accent-1 text-white rounded-md hover:bg-accent-2 transition-colors"
        >
          {isConfiguring ? 'Cancel' : (translations?.admin?.backendSelector?.configure || 'Configure')}
        </button>
      </div>

      <div id="backend-current-status" className="mb-6 p-4 bg-card rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-muted-foreground">
              {translations?.admin?.backendSelector?.currentBackend || 'Current Backend'}:
            </span>
            <span className="ml-2 font-semibold capitalize">{currentBackend}</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(testResults[currentBackend] || 'idle')}
            <button
              id="test-connection-button"
              onClick={() => testConnection(currentBackend)}
              className="text-sm text-accent-1 hover:text-accent-2"
              disabled={testResults[currentBackend] === 'testing'}
            >
              {translations?.admin?.backendSelector?.testConnection || 'Test Connection'}
            </button>
          </div>
        </div>
      </div>

      {isConfiguring && (
        <div id="backend-configuration-panel" className="space-y-6">
          <div id="backend-type-selector">
            <label className="block text-sm font-medium mb-3">
              {translations?.admin?.backendSelector?.selectBackend || 'Select Backend Type'}
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['filesystem', 'database', 'cms'] as BackendType[]).map((type) => (
                <button
                  key={type}
                  id={`backend-option-${type}`}
                  onClick={() => handleBackendTypeChange(type)}
                  className={`p-4 rounded-md border-2 transition-colors ${
                    currentBackend === type
                      ? 'border-accent-1 bg-accent-1/10'
                      : 'border-border hover:border-accent-1/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">
                      {type === 'filesystem' && '📁'}
                      {type === 'database' && '🗄️'}
                      {type === 'cms' && '☁️'}
                    </div>
                    <div className="font-medium capitalize">{type}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {currentBackend === 'database' && renderDatabaseConfig()}
          {currentBackend === 'cms' && renderCMSConfig()}

          <div id="backend-advanced-options" className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              {translations?.admin?.backendSelector?.advancedOptions || 'Advanced Options'}
            </h3>
            
            <div id="backend-sync-option" className="flex items-center gap-3">
              <input
                id="enable-sync-checkbox"
                type="checkbox"
                checked={backendConfig.syncEnabled}
                onChange={(e) => setBackendConfig(prev => ({
                  ...prev,
                  syncEnabled: e.target.checked
                }))}
                className="w-4 h-4"
              />
              <label htmlFor="enable-sync-checkbox" className="text-sm">
                {translations?.admin?.backendSelector?.enableSync || 'Enable automatic sync with fallback backend'}
              </label>
            </div>
          </div>

          <div id="backend-actions" className="flex gap-4 pt-6 border-t">
            <button
              id="save-backend-config-button"
              onClick={handleConfigSave}
              className="px-6 py-2 bg-accent-1 text-white rounded-md hover:bg-accent-2 transition-colors"
            >
              {translations?.admin?.backendSelector?.saveConfig || 'Save Configuration'}
            </button>
            <button
              id="test-new-backend-button"
              onClick={() => testConnection(currentBackend)}
              className="px-6 py-2 border border-accent-1 text-accent-1 rounded-md hover:bg-accent-1/10 transition-colors"
              disabled={testResults[currentBackend] === 'testing'}
            >
              {translations?.admin?.backendSelector?.testNewBackend || 'Test New Backend'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
