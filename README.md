## 🌐 Demo Live

Here is a working live demo: https://jobi-jobportal.vercel.app/

## 📝 Description

Ugandan Jobsis an advanced job portal website designed to streamline the hiring process for employers and provide a comprehensive job search experience for candidates. Employers can create job posts, shortlist favorite candidates, and manage their hiring process efficiently through a feature-rich admin dashboard. Candidates can apply for jobs, track their application status, and more. Ugandan Jobsincludes a plethora of features aimed at enhancing both user and admin experiences.

## Features

### Admin Dashboard

- **Analytics:** Get insights into job postings, applications, and user engagement.
- **User Management:** View and manage detailed information about all users.
- **Job Management:** Easily create, edit, and delete job postings.
- **Notifications:** Stay updated with alerts and notifications regarding job applications and other important activities.

### Employer Dashboard

- **Job Analytics:** Monitor the performance of job postings and track application statistics.
- **Candiate Search:** Find and shortlist candidates that match your expectations and preferences
- **Candidate Shortlisting:** Shortlist and manage favorite candidates for different job postings.
- **Share Candidates with adminstration:** Employee sharing information with admin about shortlisted candidates.
- **Profile Management:** Update company information and job posting details.

## 📖 Table of Contents (Optional)

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

## 🛠️ Setup Project

To get this project up and running in your development environment, follow these step-by-step instructions.

### 🍴 Prerequisites

We need to install or make sure that these tools are pre-installed on your machine:

- [NodeJS](https://nodejs.org/en/download/): It is a JavaScript runtime build.
- [Git](https://git-scm.com/downloads): It is an open source version control system.

- [clerk Webhook](https://clerk.com/docs/integrations/webhooks/overview): Setup a webhook integration on your project.

### 🚀 Install Project

1. Clone the Repository

```bash
git clone https://github.com/rakibtweets/jobi-nextjs.git

```

2. Install packages in directory project directory

```
npm install
```

3. In root directory create a `.env.local` file and add necessary environment variables

```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=

NEXT_CLERK_WEBHOOK_SECRET=

NEXT_PUBLIC_TINY_EDITOR_API_KEY=

NEXT_PUBLIC_SERVER_URL=

MONGODB_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## 🔍 Usage

### How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/rakibtweets/jobi-nextjs.git

# Go into the repository
$ cd jobi

# Install dependencies
$ npm install

# Run the app
$ npm start
```

> **Note**
> If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## 📋 License

MIT License

Copyright (c) [2024] [Jobi]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
