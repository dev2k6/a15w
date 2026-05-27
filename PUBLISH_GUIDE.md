# Publishing A15W to npm

This guide walks through publishing A15W as an npm package for `npx a15w` usage.

---

## 📦 Package Structure

```
a15w/
├── package.json          # npm metadata (created)
├── bin/
│   └── a15w.js          # CLI entry point (created)
├── skills/              # Skill definitions (7 files)
├── AGENT.md             # AI agent protocol
├── README.md            # Documentation
├── manifest.json        # Skill registration
└── LICENSE              # MIT License
```

---

## 🚀 Publishing Steps

### 1. Verify Package Configuration

```bash
npm pack --dry-run
```

This shows what files will be included without publishing.

### 2. Login to npm

```bash
npm login
```

Enter your npm credentials.

### 3. Publish Package

```bash
npm publish --access public
```

First publish requires `--access public` for scoped packages (though `a15w` is unscoped).

### 4. Verify Installation

```bash
npx a15w@latest
```

Should display package info and skill count.

---

## 📝 package.json Requirements

Current `package.json` includes:

- ✅ `name`: `a15w` (unique on npm)
- ✅ `version`: `1.0.0` (semver)
- ✅ `bin`: CLI entry point at `./bin/a15w.js`
- ✅ `files`: Whitelist of published files
- ✅ `keywords`: Discoverability tags
- ✅ `repository`: GitHub link
- ✅ `license`: MIT
- ✅ `engines`: Node version requirement

---

## 🔧 CLI Entry Point

`bin/a15w.js` provides:

- Package info display
- Skill count and statistics
- Quick reference to documentation
- Repository link

**Important:** File must have shebang `#!/usr/bin/env node`

---

## 📋 Pre-Publish Checklist

- [ ] `package.json` validated with `npm pack --dry-run`
- [ ] All required files listed in `files` array
- [ ] `bin/a15w.js` has executable permissions (npm handles this)
- [ ] Version number follows semver
- [ ] README.md includes installation instructions
- [ ] No sensitive data in package (secrets, credentials)
- [ ] Keywords optimized for discoverability
- [ ] Repository URL points to public GitHub repo

---

## 🎯 Post-Publish Actions

### Update README Installation Section

After publishing, users can install via:

```bash
# Run CLI
npx a15w

# Or install globally
npm install -g a15w
```

### GitHub Release

1. Create release tag: `git tag v1.0.0`
2. Push tag: `git push origin v1.0.0`
3. Create GitHub release with `RELEASE_NOTES_v1.0.0.md`

### Documentation Updates

- Add npm badge to README: `[![npm](https://img.shields.io/npm/v/a15w.svg)](https://www.npmjs.com/package/a15w)`
- Add installation via npm instructions
- Update AGENT.md if npm-specific usage patterns emerge

---

## 🔄 Version Bumping

For future releases:

```bash
# Patch (1.0.0 → 1.0.1)
npm version patch

# Minor (1.0.0 → 1.1.0)
npm version minor

# Major (1.0.0 → 2.0.0)
npm version major

# Then publish
npm publish
```

---

## ⚠️ Common Issues

### Package Name Taken

If `a15w` is taken on npm:

1. Check availability: `npm view a15w`
2. Consider scoped package: `@dev2k6/a15w`
3. Or alternative name: `a15w-skills`, `ai-agent-skills-a15w`

### Permission Denied on Publish

```bash
npm whoami  # Verify logged in
npm access public a15w  # If needed
```

### Files Not Included

Verify `files` array in `package.json` includes all necessary paths. Use `npm pack --dry-run` to preview.

---

## 📊 Package Stats After Publish

Expected npm page will show:

- Package name: `a15w`
- Version: `1.0.0`
- Description: Production-grade skill arsenal...
- Keywords: ai, code-review, security-audit...
- Dependencies: 0 (no runtime dependencies)
- Size: ~50KB (skills + docs)
- License: MIT
- Repository: github.com/dev2k6/a15w

---

## 🔗 Useful Commands

```bash
# View package info
npm view a15w

# Check published files
npm pack --dry-run

# Unpublish (within 72 hours, if needed)
npm unpublish a15w@1.0.0

# Deprecate version
npm deprecate a15w@1.0.0 "Use latest version"

# Search npm
npm search a15w
```

---

**A15W — Publish once, distribute everywhere.**