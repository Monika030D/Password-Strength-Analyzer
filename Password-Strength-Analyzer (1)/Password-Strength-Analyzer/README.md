# Password Strength Analyzer

A beginner-friendly web project that evaluates password strength locally in the browser.

## Features

- Password length check
- Uppercase/lowercase check
- Number and special-character check
- Common password and predictable-pattern detection
- Strength score from 0–100
- Weak / Medium / Strong / Very Strong status
- Improvement suggestions
- Show/hide password
- Secure random password generator using Web Crypto API
- Responsive UI for desktop and mobile
- No password is sent to a server

## Technologies

- HTML5
- CSS3
- JavaScript
- Web Crypto API

## How to run

1. Open the project folder in VS Code.
2. Open `index.html`.
3. Right-click `index.html`.
4. Select **Open with Live Server** if you have the Live Server extension.
5. Or simply double-click `index.html` to open it in a browser.

## Important security note

This is an educational/demo project. The score is a heuristic, not a guarantee of password security.

For real authentication systems:
- Never store plaintext passwords.
- Use a slow password-hashing algorithm such as Argon2id, scrypt, or bcrypt.
- Use a unique salt for every password.
- Consider checking passwords against known compromised-password datasets using a privacy-preserving approach.
- Enforce rate limiting and multi-factor authentication where appropriate.
