# Page snapshot

```yaml
- button "Open settings"
- banner:
  - heading "Admin Dashboard" [level=1]
  - paragraph: Manage your content and settings
  - button "← Back to Site"
- navigation:
  - button "Dashboard"
  - button "Analytics"
  - button "Backend"
- heading "Article Backend Configuration" [level=2]
- button "Cancel"
- text: Current Backend:database
- button "Test Connection"
- text: Select Backend Type
- button "📁 filesystem"
- button "🗄️ database"
- button "☁️ cms"
- text: Database Type
- combobox "Database Type":
  - option "PostgreSQL"
  - option "MySQL"
  - option "SQLite" [selected]
- text: Database File
- textbox "Database File": ./articles.db
- heading "Advanced Options" [level=3]
- checkbox "Enable automatic sync with fallback backend"
- text: Enable automatic sync with fallback backend
- button "Save Configuration"
- button "Test New Backend"
- alert: Admin Dashboard
```