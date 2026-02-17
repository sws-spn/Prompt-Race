import type { Scenario } from '../types';

export const scenarios: Scenario[] = [
  // ========== TROUBLESHOOTING (12 scenarios) ==========
  {
    id: 'ts-001',
    category: 'troubleshooting',
    title: 'Shared Mailbox Access Failure',
    situation: 'A user reports they can no longer access a shared mailbox in Outlook. It was working yesterday. Other users can still access the same shared mailbox without issues. The affected user\'s personal mailbox works fine. They\'re on Windows 11 running the new Outlook client. No recent password changes.',
    roleHint: 'Consider what systematic diagnostic steps would help isolate the issue.',
    difficulty: 2,
    idealElements: ['role context', 'environment specifics included', 'asks for structured diagnostic steps', 'mentions what has been tried', 'scopes the issue clearly'],
    examplePrompt: {
      prompt: `You are an experienced MSP service desk technician. A user on Windows 11 with the new Outlook client suddenly lost access to a shared mailbox that was working yesterday. Their personal mailbox works fine, and other users can still access this shared mailbox without issues. No password changes were made.

Please provide a systematic troubleshooting checklist, starting with the most likely causes and quick fixes first, then progressing to more complex solutions. Format as a numbered list with brief explanations of what each step checks for.`,
      breakdown: {
        context: 'Includes all relevant details: OS version, Outlook client type, timeline, what works vs. what doesn\'t, and confirms other users aren\'t affected.',
        taskClarity: 'Clearly asks for a "systematic troubleshooting checklist" - the AI knows exactly what deliverable to produce.',
        constraintsFormat: 'Specifies format (numbered list with explanations) and prioritization (quick fixes first, then complex).',
        aupAwareness: 'No real user names, email addresses, or company information included.',
        practicalValue: 'The structured checklist approach will produce actionable steps a tech can follow immediately.'
      }
    }
  },
  {
    id: 'ts-002',
    category: 'troubleshooting',
    title: 'VPN Connection Dropping',
    situation: 'A remote employee reports their GlobalProtect VPN connection drops every 15-20 minutes. They have to manually reconnect each time. This started after they got a new home router last week. Other remote employees are not experiencing this issue. They\'re on a company-managed MacBook running macOS Sonoma.',
    roleHint: 'Think about both client-side and network-side factors.',
    difficulty: 2,
    idealElements: ['systematic approach', 'considers network factors', 'asks about router settings', 'mentions timing correlation', 'requests specific logs'],
    examplePrompt: {
      prompt: `Acting as a senior network support technician, I need to diagnose intermittent VPN disconnections.

Environment: Company-managed MacBook on macOS Sonoma using GlobalProtect VPN. User is remote.

Symptoms: VPN drops every 15-20 minutes requiring manual reconnection. Started after user installed a new home router last week. Other remote users on similar setups are unaffected.

Please provide:
1. Most likely causes given the router timing correlation
2. Router settings to check/modify (common consumer router brands)
3. Client-side diagnostic steps and logs to collect
4. Escalation criteria if basic troubleshooting fails`,
      breakdown: {
        context: 'Provides complete environment details, exact symptoms, timing correlation with router change, and confirms the issue is isolated to this user.',
        taskClarity: 'Lists four specific deliverables the AI should provide, leaving no ambiguity about what\'s needed.',
        constraintsFormat: 'Uses numbered sections to organize the request, making it easy for AI to structure the response.',
        aupAwareness: 'Generic description without employee names or company-specific identifiers.',
        practicalValue: 'The router correlation is highlighted, which will focus the AI\'s response on the most likely cause.'
      }
    }
  },
  {
    id: 'ts-003',
    category: 'troubleshooting',
    title: 'Printer Not Appearing',
    situation: 'A user on a new Windows 11 laptop cannot see any network printers. Other users in the same office can print normally. The laptop is domain-joined and on the corporate network. The user can access shared drives and other network resources without issues.',
    difficulty: 1,
    idealElements: ['checks print spooler', 'verifies driver status', 'considers group policy', 'methodical approach'],
    examplePrompt: {
      prompt: `I'm troubleshooting a printing issue on a newly deployed Windows 11 laptop.

Situation: User cannot see any network printers. The laptop is domain-joined and connected to the corporate network. Shared drives and other network resources work fine. Other users in the same office can print without issues.

As a desktop support technician, what step-by-step diagnostic process should I follow? Please start with the quickest checks and work toward more involved solutions. Include relevant PowerShell commands where applicable.`,
      breakdown: {
        context: 'Describes the new laptop, domain membership, working network connectivity, and that the issue is isolated to this device.',
        taskClarity: 'Requests a "step-by-step diagnostic process" - clear deliverable.',
        constraintsFormat: 'Asks for quick checks first, then involved solutions. Requests PowerShell commands for efficiency.',
        aupAwareness: 'No specific printer names, IP addresses, or user identifiers.',
        practicalValue: 'The progression from quick to complex will help resolve simple issues fast without over-complicating.'
      }
    }
  },
  {
    id: 'ts-004',
    category: 'troubleshooting',
    title: 'Teams Calls No Audio',
    situation: 'During Microsoft Teams calls, a user can see video but has no audio in either direction - they can\'t hear others and others can\'t hear them. Chat and screen sharing work fine. They\'re using a USB headset that works correctly in other applications. This happens on both scheduled meetings and ad-hoc calls.',
    roleHint: 'Audio issues often involve multiple layers of settings.',
    difficulty: 2,
    idealElements: ['checks Teams audio settings', 'verifies device permissions', 'tests with different devices', 'systematic isolation'],
    examplePrompt: {
      prompt: `Microsoft Teams audio troubleshooting needed.

Issue: User has no audio in either direction during Teams calls (can't hear others, others can't hear them). Video, chat, and screen sharing all work normally.

Environment details:
- USB headset that works correctly in other applications (tested in Zoom and system sounds)
- Issue occurs in both scheduled meetings and ad-hoc calls
- Windows desktop client

Please provide a focused troubleshooting guide covering:
1. Teams-specific audio settings to verify
2. Windows audio permissions and device settings
3. How to test/isolate whether it's Teams, Windows, or hardware
4. Common fixes for this specific symptom pattern`,
      breakdown: {
        context: 'Specifies exactly what works (video, chat, headset in other apps) and what doesn\'t, helping narrow down the issue.',
        taskClarity: 'Four specific areas to cover, each clearly defined.',
        constraintsFormat: 'Organized request with bullet points for environment and numbered items for deliverables.',
        aupAwareness: 'No user names or meeting details included.',
        practicalValue: 'The fact that the headset works elsewhere immediately tells us it\'s not hardware, focusing the response appropriately.'
      }
    }
  },
  {
    id: 'ts-005',
    category: 'troubleshooting',
    title: 'Outlook Search Not Working',
    situation: 'A user reports that Outlook search returns no results for emails they know exist. They can manually browse to folders and find the emails. This affects both the search bar and the instant search in folders. They have a large mailbox (50GB+) and use Outlook on Windows with a cached Exchange mode.',
    difficulty: 1,
    idealElements: ['considers indexing status', 'checks mailbox size impact', 'rebuilds search index', 'verifies cache settings'],
    examplePrompt: {
      prompt: `Outlook search is returning no results for a user, even for emails they can find manually by browsing folders.

Setup: Windows Outlook desktop client, cached Exchange mode, large mailbox (50GB+). Issue affects both the main search bar and in-folder instant search.

What are the most common causes and fixes for this? Please provide:
- Quick diagnostic checks to identify the root cause
- Step-by-step repair procedures (in order of least to most disruptive)
- How to verify the fix worked`,
      breakdown: {
        context: 'Includes mailbox size (relevant for indexing), Outlook mode, and confirms manual browsing works.',
        taskClarity: 'Asks for diagnostics, repair procedures, and verification steps - complete troubleshooting cycle.',
        constraintsFormat: 'Requests procedures "in order of least to most disruptive" - practical prioritization.',
        aupAwareness: 'No email addresses or specific folder names mentioned.',
        practicalValue: 'The 50GB mailbox detail will prompt the AI to focus on indexing issues, which is the likely cause.'
      }
    }
  },
  {
    id: 'ts-006',
    category: 'troubleshooting',
    title: 'OneDrive Sync Stuck',
    situation: 'A user\'s OneDrive shows "Sync Pending" for several files but hasn\'t made progress in two days. The OneDrive icon shows a blue sync arrow that never completes. They have 200GB of data in OneDrive. Restarting OneDrive and the computer haven\'t helped. Internet speed tests show normal connectivity.',
    roleHint: 'Sync issues can be caused by specific files or broader configuration problems.',
    difficulty: 2,
    idealElements: ['identifies stuck files', 'checks for file conflicts', 'considers file name/path issues', 'examines sync logs'],
    examplePrompt: {
      prompt: `OneDrive sync has been stuck for 2 days showing "Sync Pending" with a blue sync arrow that never completes.

Details:
- 200GB of data in OneDrive
- Already tried: restarting OneDrive client, rebooting computer
- Internet connectivity confirmed normal via speed tests
- Multiple files affected

As a support technician, I need to identify what's blocking sync and resolve it. Please provide:
1. How to identify which specific files are stuck
2. Common causes for stuck sync (file names, size, conflicts)
3. Resolution steps from least to most aggressive
4. When to escalate to Microsoft support`,
      breakdown: {
        context: 'Includes data size, duration of issue, what\'s already been tried, and confirms internet is working.',
        taskClarity: 'Four specific numbered deliverables covering identification, causes, resolution, and escalation.',
        constraintsFormat: 'Asks for resolution steps "from least to most aggressive" - prevents data loss from overly aggressive fixes.',
        aupAwareness: 'No file names, paths, or user account details.',
        practicalValue: 'Mentioning what\'s been tried prevents the AI from suggesting redundant steps.'
      }
    }
  },
  {
    id: 'ts-007',
    category: 'troubleshooting',
    title: 'MFA Prompt Loop',
    situation: 'A user keeps getting prompted for MFA every time they open any Microsoft 365 application, even though they complete the verification successfully. This happens multiple times per hour. They\'re using the Microsoft Authenticator app. Other users on similar devices are only prompted once per day.',
    difficulty: 2,
    idealElements: ['examines token persistence', 'checks conditional access', 'verifies device registration', 'considers browser/app settings'],
    examplePrompt: {
      prompt: `A user is experiencing excessive MFA prompts - being asked to verify with Microsoft Authenticator every time they open any M365 app, multiple times per hour. They complete verification successfully each time, but it doesn't persist. Other users on similar devices only see MFA prompts once daily.

I need to diagnose why tokens aren't persisting for this user. Please explain:
1. What typically causes MFA tokens to not persist
2. Diagnostic steps to identify the specific cause (device registration, conditional access, browser settings)
3. Fixes for each potential cause
4. How to verify the issue is resolved`,
      breakdown: {
        context: 'Describes the symptom precisely (successful auth but not persisting), frequency, and that other users aren\'t affected.',
        taskClarity: 'Asks for causes, diagnostics, fixes, and verification - complete troubleshooting workflow.',
        constraintsFormat: 'Numbered list format requested, with specific areas to investigate mentioned.',
        aupAwareness: 'No user name, tenant name, or device identifiers.',
        practicalValue: 'Comparing to "other users only prompted once daily" establishes the expected baseline behavior.'
      }
    }
  },
  {
    id: 'ts-008',
    category: 'troubleshooting',
    title: 'Slow Login Times',
    situation: 'Users at a specific office location report that logging into their Windows computers takes 5+ minutes. The login process appears to hang at "Welcome" for a long time. This affects all users at this location but no other offices. Network connectivity tests show normal speeds.',
    roleHint: 'Location-specific issues often point to infrastructure factors.',
    difficulty: 3,
    idealElements: ['considers group policy processing', 'checks DNS resolution', 'examines domain controller connectivity', 'reviews login scripts'],
    examplePrompt: {
      prompt: `Windows login is taking 5+ minutes at one office location, hanging at the "Welcome" screen. This affects all users at this site but no other offices. Basic network tests show normal connectivity speeds.

I need to diagnose this location-specific issue. Acting as a systems administrator, please provide:

1. Most likely infrastructure causes for site-specific slow logins
2. Diagnostic commands/tools to run (with expected output examples)
3. How to identify if it's DNS, Group Policy, DC replication, or login scripts
4. Quick wins vs. fixes requiring change control`,
      breakdown: {
        context: 'Establishes the site-specific pattern, exact symptom (hangs at Welcome), duration, and rules out basic network issues.',
        taskClarity: 'Requests causes, diagnostics with examples, differentiation between causes, and change control considerations.',
        constraintsFormat: 'Asks for "quick wins vs. fixes requiring change control" - practical MSP consideration.',
        aupAwareness: 'No office name, IP ranges, or domain names.',
        practicalValue: 'The "Welcome" screen hang specifically points to post-authentication processing, focusing the response.'
      }
    }
  },
  {
    id: 'ts-009',
    category: 'troubleshooting',
    title: 'Calendar Invites Not Received',
    situation: 'A user reports they\'re not receiving calendar invites from external contacts. Internal invites work fine. The senders confirm the invites are being sent and don\'t receive bounce-backs. Checking the user\'s junk folder shows nothing. The user is on Microsoft 365 with Exchange Online.',
    difficulty: 2,
    idealElements: ['checks mail flow rules', 'examines transport rules', 'verifies inbox rules', 'considers external sharing settings'],
    examplePrompt: {
      prompt: `Calendar invites from external senders are not being received by a user. Internal calendar invites work normally.

Confirmed so far:
- External senders confirm invites sent successfully (no bounce-backs)
- Nothing in user's junk/spam folder
- User is on Exchange Online (M365)

I need to trace where these external calendar invites are going. Please provide a diagnostic approach covering:
1. Message trace steps to find the invites
2. Common causes (transport rules, inbox rules, external sharing settings)
3. Specific admin portals and settings to check
4. How to test once a fix is applied`,
      breakdown: {
        context: 'Clearly states internal works but external doesn\'t, confirms no bounce-backs, and notes junk folder was checked.',
        taskClarity: 'Asks for message tracing, common causes, where to look, and how to verify - complete diagnostic path.',
        constraintsFormat: 'Numbered list with specific areas to cover.',
        aupAwareness: 'No email addresses, domain names, or user identifiers.',
        practicalValue: 'The "no bounce-backs" detail tells us the emails are being accepted somewhere, helping narrow the search.'
      }
    }
  },
  {
    id: 'ts-010',
    category: 'troubleshooting',
    title: 'Application Crash on Launch',
    situation: 'A line-of-business application crashes immediately after launch on one user\'s computer. The same application works for other users. The application was working fine until the user\'s laptop received Windows updates over the weekend. Event Viewer shows an application error with a faulting module name.',
    difficulty: 1,
    idealElements: ['examines event logs', 'checks application dependencies', 'considers recent changes', 'tests compatibility settings'],
    examplePrompt: {
      prompt: `A line-of-business application crashes immediately on launch for one user. It worked until Windows updates were applied over the weekend. The same app works for other users.

Event Viewer shows an application error with a faulting module name.

Please help me troubleshoot this with:
1. How to interpret the Event Viewer application error (what to look for in the faulting module)
2. Common causes when crashes correlate with Windows updates
3. Step-by-step resolution options (from quick fixes to reinstallation)
4. How to prevent this in future update cycles`,
      breakdown: {
        context: 'Identifies the timing correlation with Windows updates, confirms it\'s user-specific, and mentions Event Viewer has error details.',
        taskClarity: 'Four specific deliverables covering interpretation, causes, resolution, and prevention.',
        constraintsFormat: 'Requests options "from quick fixes to reinstallation" - progressive approach.',
        aupAwareness: 'Doesn\'t name the specific application or user.',
        practicalValue: 'The Windows update correlation is the key diagnostic clue that will drive useful suggestions.'
      }
    }
  },
  {
    id: 'ts-011',
    category: 'troubleshooting',
    title: 'Email Attachment Size Limit',
    situation: 'A user needs to send a 35MB attachment but receives an error that the file is too large. They\'ve successfully sent large files before. The recipient is at an external organization. The user is on Microsoft 365 and can send smaller attachments without issues.',
    roleHint: 'Message size limits can exist at multiple points in the mail flow.',
    difficulty: 1,
    idealElements: ['explains size limits', 'suggests alternatives', 'considers recipient limits', 'mentions OneDrive sharing'],
    examplePrompt: {
      prompt: `User can't send a 35MB email attachment - getting a size limit error. They're on M365 and have sent large attachments before. The recipient is external. Smaller attachments work fine.

Please explain:
1. Where size limits can exist in the mail flow (sender, recipient, transport)
2. What the default M365 limits are
3. Alternative methods to share the file securely (with pros/cons of each)
4. How to communicate the alternative to the user professionally`,
      breakdown: {
        context: 'Specifies exact file size, that large attachments worked before, external recipient, and small attachments still work.',
        taskClarity: 'Four distinct questions covering limits, alternatives, and communication.',
        constraintsFormat: 'Asks for "pros/cons" of alternatives - helps user make informed choice.',
        aupAwareness: 'No file names, recipient addresses, or company details.',
        practicalValue: 'Asking about professional communication helps the tech explain the workaround to the user.'
      }
    }
  },
  {
    id: 'ts-012',
    category: 'troubleshooting',
    title: 'Intune Device Compliance Failure',
    situation: 'A user\'s corporate phone suddenly shows as non-compliant in Intune and they\'re being blocked from accessing company email. The compliance dashboard shows "BitLocker not enabled" but this is an iPhone, which doesn\'t use BitLocker. The device was compliant until this morning.',
    roleHint: 'Compliance policy targeting can sometimes cause unexpected results.',
    difficulty: 3,
    idealElements: ['examines policy assignment', 'checks device group membership', 'reviews compliance policy scope', 'considers recent policy changes'],
    examplePrompt: {
      prompt: `An iPhone is showing as non-compliant in Intune with the error "BitLocker not enabled" - but iPhones don't use BitLocker. The device was compliant until this morning and the user is now blocked from company email.

This appears to be a policy targeting issue. Please help me:
1. Identify how a Windows-specific compliance requirement got applied to an iOS device
2. Diagnostic steps in Intune admin center to trace the policy assignment
3. How to fix this for the affected user immediately
4. How to prevent this from affecting other iOS devices`,
      breakdown: {
        context: 'Identifies the impossible requirement (BitLocker on iPhone), timing of change, and business impact (blocked email).',
        taskClarity: 'Four specific asks covering root cause, diagnostics, immediate fix, and prevention.',
        constraintsFormat: 'Organized as numbered list with clear scope for each item.',
        aupAwareness: 'No user name, device serial, or tenant identifiers.',
        practicalValue: 'Recognizing this as a policy targeting issue (not a device issue) frames the troubleshooting correctly.'
      }
    }
  },

  // ========== CLIENT COMMUNICATION (12 scenarios) ==========
  {
    id: 'cc-001',
    category: 'client-communication',
    title: 'Scheduled Maintenance Notification',
    situation: 'You need to notify end users at a client site that their email system will be unavailable for up to 30 minutes this Saturday between 2:00 AM and 4:00 AM for scheduled maintenance. No action is required from them. This client has non-technical users who tend to worry about changes.',
    roleHint: 'Consider the audience\'s technical level and emotional response to IT changes.',
    difficulty: 1,
    idealElements: ['specifies audience (non-technical)', 'tone (reassuring)', 'key details to include', 'what to omit', 'format'],
    examplePrompt: {
      prompt: `Please draft a maintenance notification email for end users.

Audience: Non-technical office workers who tend to worry about IT changes
Tone: Reassuring and professional, not alarming

Details to include:
- Email will be unavailable for up to 30 minutes
- Window: Saturday 2:00 AM - 4:00 AM
- No action required from users
- This is routine maintenance

Details to omit:
- Technical jargon
- Specific systems being updated
- Anything that might cause unnecessary concern

Format: Brief email (under 150 words) with clear subject line`,
      breakdown: {
        context: 'Defines the audience (non-technical, worry-prone) and provides all necessary details.',
        taskClarity: 'Asks for a specific deliverable: a maintenance notification email.',
        constraintsFormat: 'Specifies tone, what to include, what to omit, word count, and format requirements.',
        aupAwareness: 'No client name, specific systems, or real contact information.',
        practicalValue: 'The "under 150 words" constraint ensures a concise, readable notification.'
      }
    }
  },
  {
    id: 'cc-002',
    category: 'client-communication',
    title: 'Security Incident Summary',
    situation: 'A user at a client company clicked a phishing link and entered their credentials. You\'ve already reset their password and revoked sessions. Now you need to send a summary email to the client\'s IT manager explaining what happened, what you did, and what the user should do going forward.',
    roleHint: 'Balance transparency with appropriate reassurance.',
    difficulty: 2,
    idealElements: ['factual but not alarming', 'clear timeline', 'actions taken', 'next steps', 'professional tone'],
    examplePrompt: {
      prompt: `Draft a security incident summary email to a client's IT manager.

Incident: An employee clicked a phishing link and entered their credentials.
Actions already taken: Password reset, all active sessions revoked.

The email should:
- Be factual and professional without being alarmist
- Include a brief timeline of events and response
- Confirm what remediation steps were completed
- Outline what the affected user should do/watch for
- Offer to discuss additional security measures

Tone: Transparent, confident, solution-focused
Length: Concise but complete (200-300 words)`,
      breakdown: {
        context: 'Describes the incident, recipient (IT manager), and actions already taken.',
        taskClarity: 'Clearly asks for a summary email with specific sections to include.',
        constraintsFormat: 'Bullet list of requirements, specified tone, and word count range.',
        aupAwareness: 'No employee name, client name, or specific credentials mentioned.',
        practicalValue: 'The "solution-focused" tone direction ensures the email demonstrates competent incident handling.'
      }
    }
  },
  {
    id: 'cc-003',
    category: 'client-communication',
    title: 'Service Outage Update',
    situation: 'A client\'s critical line-of-business application has been down for 2 hours. You\'re working with the vendor but don\'t have an ETA yet. The client\'s CEO has been asking for updates every 30 minutes. You need to send a status update that acknowledges the impact without making promises you can\'t keep.',
    difficulty: 2,
    idealElements: ['empathetic acknowledgment', 'current status', 'what is being done', 'when next update will come', 'avoids false promises'],
    examplePrompt: {
      prompt: `Write a status update email for an ongoing critical outage.

Situation:
- Client's critical application has been down for 2 hours
- Working with the vendor, but no ETA for resolution yet
- CEO is requesting updates every 30 minutes

The email must:
- Acknowledge the business impact empathetically
- Explain current troubleshooting status honestly
- Avoid promises about resolution time we can't guarantee
- Commit to a specific next-update time
- Maintain confidence in our ability to resolve

Recipient: CEO (executive-level communication)
Tone: Empathetic, honest, professional
Length: Brief (100-150 words) - executives want quick reads`,
      breakdown: {
        context: 'Provides duration, vendor involvement, no ETA, and CEO escalation level.',
        taskClarity: 'Requests a status update email with five specific requirements.',
        constraintsFormat: 'Specifies recipient level, tone, and length constraint for busy executives.',
        aupAwareness: 'No client name, application name, or vendor name.',
        practicalValue: 'The "avoid promises we can\'t guarantee" instruction prevents overpromising during uncertainty.'
      }
    }
  },
  {
    id: 'cc-004',
    category: 'client-communication',
    title: 'New Employee Onboarding Email',
    situation: 'A new employee is starting at a client company on Monday. You need to send them a welcome email with instructions for setting up their accounts, accessing email, and connecting to VPN for the first time. They\'re non-technical (marketing role) and this is their first job at a company using Microsoft 365.',
    difficulty: 1,
    idealElements: ['welcoming tone', 'step-by-step format', 'avoids jargon', 'includes support contact', 'clear next steps'],
    examplePrompt: {
      prompt: `Create a welcome email for a new employee starting Monday with first-time setup instructions.

Audience: Non-technical marketing professional, first time using Microsoft 365
Tasks to cover:
1. First-time email setup
2. VPN connection for remote access
3. Where to get help if stuck

Requirements:
- Warm, welcoming tone (they're probably nervous about new tech)
- Step-by-step format with numbered instructions
- Avoid technical jargon - explain in plain language
- Include a support contact for questions
- Keep it scannable - they'll reference this multiple times

Format: Welcome paragraph, then numbered setup sections, then support info`,
      breakdown: {
        context: 'Describes the user\'s role, technical level, and that it\'s their first M365 experience.',
        taskClarity: 'Lists three specific tasks to cover and requests a welcome email.',
        constraintsFormat: 'Specifies tone, format (numbered steps), language level, and document structure.',
        aupAwareness: 'No employee name, company name, or actual login credentials.',
        practicalValue: 'The "they\'ll reference this multiple times" insight prompts scannable formatting.'
      }
    }
  },
  {
    id: 'cc-005',
    category: 'client-communication',
    title: 'License Cost Increase Explanation',
    situation: 'Microsoft is increasing the price of Microsoft 365 Business Premium licenses by 15% next month. You need to notify affected clients before their next invoice. The client you\'re emailing is cost-conscious and has previously complained about IT expenses.',
    roleHint: 'Price increases require careful framing.',
    difficulty: 2,
    idealElements: ['empathetic to cost concerns', 'explains the value', 'notes what\'s included', 'offers to discuss alternatives', 'professional tone'],
    examplePrompt: {
      prompt: `Draft an email notifying a cost-conscious client about an upcoming Microsoft 365 price increase.

Details:
- M365 Business Premium increasing 15% next month
- This is a Microsoft price change, not our markup
- Client has previously expressed concerns about IT costs

The email should:
- Acknowledge their cost concerns upfront
- Explain this is a vendor price change (not us)
- Briefly highlight the value they get from Business Premium
- Offer to review their licenses for optimization opportunities
- Maintain our role as their advocate, not just a bill-passer

Tone: Understanding, proactive, helpful
Avoid: Apologetic groveling or defensive justification`,
      breakdown: {
        context: 'Specifies the exact increase, timing, that it\'s Microsoft\'s change, and client\'s history of cost concerns.',
        taskClarity: 'Requests a notification email with five specific elements.',
        constraintsFormat: 'Specifies tone and what to avoid, plus the framing of our role.',
        aupAwareness: 'No client name or specific license counts.',
        practicalValue: 'Offering "license optimization opportunities" turns bad news into a service opportunity.'
      }
    }
  },
  {
    id: 'cc-006',
    category: 'client-communication',
    title: 'Password Policy Change Announcement',
    situation: 'A client company is implementing a new password policy requiring 14-character passwords with complexity requirements, plus mandatory password changes every 90 days. This is being driven by their cyber insurance requirements. You need to communicate this to all employees before it takes effect next week.',
    difficulty: 2,
    idealElements: ['explains the why', 'clear requirements', 'when it takes effect', 'how to comply', 'support resources'],
    examplePrompt: {
      prompt: `Write an announcement email about new password requirements for all employees.

New requirements (effective next week):
- Minimum 14 characters
- Must include complexity (upper, lower, number, symbol)
- Mandatory change every 90 days

Why: Required by company's cyber insurance policy

The email needs to:
- Explain WHY this is happening (insurance requirement, not arbitrary IT rule)
- Clearly state the new requirements
- Give the effective date
- Provide tips for creating memorable strong passwords
- Include support contact for help

Tone: Matter-of-fact but supportive (this affects everyone)
Length: Keep it brief - long policy emails don't get read`,
      breakdown: {
        context: 'Lists all specific requirements, timing, and the business driver (insurance).',
        taskClarity: 'Asks for an announcement email with five specific components.',
        constraintsFormat: 'Specifies tone and emphasizes brevity for readability.',
        aupAwareness: 'No company name or specific contact details.',
        practicalValue: 'Including the "why" (insurance) helps employees understand it\'s not arbitrary.'
      }
    }
  },
  {
    id: 'cc-007',
    category: 'client-communication',
    title: 'Project Completion Summary',
    situation: 'You\'ve just completed a month-long Microsoft 365 migration for a client, moving them from Google Workspace. The project is complete and you need to send a wrap-up email to the client stakeholder summarizing what was accomplished, any outstanding items, and next steps for ongoing support.',
    difficulty: 2,
    idealElements: ['accomplishments listed', 'any caveats or follow-ups', 'transition to support', 'thanks the client', 'professional close'],
    examplePrompt: {
      prompt: `Write a project completion email for a Google Workspace to Microsoft 365 migration.

Project scope completed:
- Email migration (all historical data)
- Calendar migration
- Drive to OneDrive/SharePoint migration
- User training sessions

Outstanding items: None blocking, but monitoring for 2 weeks for any sync issues

The email should:
- Summarize accomplishments professionally
- Note any items still being monitored
- Explain how support requests work going forward
- Thank them for their partnership during the project
- Offer a follow-up call if they'd like to review

Recipient: Client project stakeholder
Tone: Confident, appreciative, forward-looking`,
      breakdown: {
        context: 'Lists completed scope, notes monitoring period, and identifies the recipient.',
        taskClarity: 'Requests a project completion email with five specific elements.',
        constraintsFormat: 'Specifies tone and the relationship transition from project to support.',
        aupAwareness: 'No client name, data volumes, or specific user counts.',
        practicalValue: 'Offering a follow-up call maintains the relationship and catches any concerns.'
      }
    }
  },
  {
    id: 'cc-008',
    category: 'client-communication',
    title: 'Urgent Security Alert',
    situation: 'A critical zero-day vulnerability has been announced affecting a software product that several clients use. A patch is available but requires immediate installation and a system restart. You need to send an urgent communication to affected clients explaining the situation and requesting approval to proceed.',
    roleHint: 'Urgency must be conveyed without causing panic.',
    difficulty: 3,
    idealElements: ['conveys urgency appropriately', 'explains risk clearly', 'states required action', 'provides timeline', 'requests approval'],
    examplePrompt: {
      prompt: `Draft an urgent security notification requesting client approval for emergency patching.

Situation:
- Critical zero-day vulnerability announced today
- Affects software the client uses
- Patch available, requires installation + system restart
- Active exploitation reported in the wild

The email must:
- Convey genuine urgency without causing panic
- Explain the risk in business terms (not just technical)
- State exactly what we need to do (install patch, restart)
- Propose a timeline for the work
- Request explicit approval to proceed
- Offer to call if they have questions

Tone: Urgent but professional, confident in our recommendation
Length: Concise - this needs to be read and acted on quickly`,
      breakdown: {
        context: 'Describes the vulnerability severity, available patch, required actions, and active exploitation.',
        taskClarity: 'Requests a security notification with six specific requirements.',
        constraintsFormat: 'Specifies tone balance (urgent but not panic-inducing) and brevity for quick action.',
        aupAwareness: 'No specific software name, client name, or system details.',
        practicalValue: 'Requesting "explicit approval" creates a clear decision point and audit trail.'
      }
    }
  },
  {
    id: 'cc-009',
    category: 'client-communication',
    title: 'Declined Request Response',
    situation: 'A user at a client company has requested admin access to their company\'s Microsoft 365 tenant so they can "manage things themselves." The client\'s IT policy doesn\'t allow this, and the request needs to be declined. You need to respond to the user professionally while maintaining the relationship.',
    difficulty: 2,
    idealElements: ['respectful decline', 'explains the policy reason', 'offers alternatives', 'maintains relationship', 'appropriate tone'],
    examplePrompt: {
      prompt: `Write a response declining a user's request for M365 admin access.

Request: User wants admin access to "manage things themselves"
Policy: Client's IT policy prohibits end-user admin access
Our role: We manage their M365 environment under contract

The response should:
- Decline respectfully without being condescending
- Explain why the policy exists (security, compliance, not distrust)
- Offer what we CAN do for them quickly
- Keep the door open for discussing specific needs
- Maintain a positive working relationship

Tone: Friendly, helpful, professional
Avoid: Making them feel untrusted or like they did something wrong`,
      breakdown: {
        context: 'Explains the request, the policy, and our role as their managed service provider.',
        taskClarity: 'Requests a decline response with five specific elements.',
        constraintsFormat: 'Specifies tone, what to avoid, and the relationship goal.',
        aupAwareness: 'No user name, client name, or tenant details.',
        practicalValue: 'Offering what we CAN do turns a "no" into a partial "yes."'
      }
    }
  },
  {
    id: 'cc-010',
    category: 'client-communication',
    title: 'Quarterly Review Summary',
    situation: 'You need to prepare a quarterly review email for a client summarizing the support tickets, projects completed, and recommendations for the next quarter. They had 47 tickets (down from 62 last quarter), completed a server migration, and you want to recommend upgrading their backup solution.',
    difficulty: 1,
    idealElements: ['structured format', 'highlights improvements', 'data-driven', 'actionable recommendations', 'professional tone'],
    examplePrompt: {
      prompt: `Write a quarterly IT review summary email for a client.

Data to include:
- Support tickets: 47 this quarter (down from 62 last quarter)
- Major project completed: Server migration
- Recommendation: Upgrade backup solution (current solution aging)

The email should:
- Present ticket data positively (24% reduction)
- Summarize the server migration success briefly
- Frame the backup recommendation as proactive, not critical
- Offer to schedule a call to discuss in detail

Format:
- Brief executive summary paragraph
- Bulleted sections for metrics, projects, recommendations
- Clear call-to-action at end

Tone: Confident, consultative, data-driven`,
      breakdown: {
        context: 'Provides specific metrics, completed work, and the recommendation.',
        taskClarity: 'Requests a quarterly review email with structured format requirements.',
        constraintsFormat: 'Specifies exact format (summary + bullets + CTA), tone, and how to frame each section.',
        aupAwareness: 'No client name, server details, or specific system names.',
        practicalValue: 'Framing the ticket reduction as a percentage (24%) sounds more impressive than raw numbers.'
      }
    }
  },
  {
    id: 'cc-011',
    category: 'client-communication',
    title: 'After-Hours Work Approval',
    situation: 'A client needs critical server maintenance that requires 4 hours of downtime. This can only be done outside business hours. You need to send an email proposing the maintenance window, explaining why after-hours work is necessary, and getting approval for the associated after-hours billing.',
    difficulty: 2,
    idealElements: ['clear proposal', 'justifies after-hours need', 'states cost implications', 'proposes specific time', 'requests explicit approval'],
    examplePrompt: {
      prompt: `Write an email requesting approval for after-hours maintenance work.

Details:
- Server maintenance requiring 4 hours of downtime
- Must be done outside business hours to avoid user impact
- Proposing Saturday 10 PM - 2 AM
- After-hours rates apply (1.5x standard rate)

The email needs to:
- Explain what maintenance is needed and why
- Justify why it must be after-hours (user impact)
- Clearly state the proposed window
- Be transparent about after-hours billing
- Request explicit written approval

Tone: Professional, transparent about costs
Format: Brief and clear - this needs a decision`,
      breakdown: {
        context: 'Specifies duration, reason for after-hours, proposed window, and rate structure.',
        taskClarity: 'Requests an approval email with five specific components.',
        constraintsFormat: 'Emphasizes transparency about costs and requests explicit approval.',
        aupAwareness: 'No server name, client name, or specific dollar amounts.',
        practicalValue: 'Requesting "explicit written approval" creates documentation for billing.'
      }
    }
  },
  {
    id: 'cc-012',
    category: 'client-communication',
    title: 'Data Breach Notification Draft',
    situation: 'A client discovered that an employee accidentally shared a folder containing customer PII with external parties for 3 days before it was caught. The client needs to notify affected customers. They\'ve asked you to help draft the notification letter that will go out under their letterhead.',
    roleHint: 'Data breach notifications have legal implications and require careful wording.',
    difficulty: 3,
    idealElements: ['factual account', 'what data was exposed', 'steps taken', 'what recipients should do', 'appropriate tone', 'contact information'],
    examplePrompt: {
      prompt: `Help draft a data breach notification letter for customers.

Incident: Employee accidentally shared a folder containing customer PII with external parties. Exposure lasted 3 days before discovery and remediation.

Important notes:
- This will go out under the CLIENT's letterhead (not ours)
- Must be factual but not legally problematic
- Should recommend this be reviewed by their legal counsel

The letter needs to include:
- What happened (factual, brief)
- What data may have been exposed
- What steps were taken after discovery
- What the recipient should do (monitor accounts, etc.)
- How to contact the company with questions

Tone: Apologetic, transparent, responsible
Note: Add a disclaimer that this is a draft requiring legal review`,
      breakdown: {
        context: 'Describes the incident, duration, that it\'s the client\'s letterhead, and the need for legal review.',
        taskClarity: 'Requests a notification letter with five specific sections.',
        constraintsFormat: 'Specifies tone and the critical requirement to flag for legal review.',
        aupAwareness: 'No actual PII types, client name, or customer details.',
        practicalValue: 'The legal review disclaimer protects both us and the client.'
      }
    }
  },

  // ========== DOCUMENTATION (12 scenarios) ==========
  {
    id: 'doc-001',
    category: 'documentation',
    title: 'VPN System Extension Fix',
    situation: 'You just resolved a ticket where a macOS user couldn\'t connect to GlobalProtect VPN because macOS blocked the system extension. The fix was approving the extension in System Settings > Privacy & Security, then restarting the VPN client. Root cause was a missing PPPC profile in the MDM configuration.',
    roleHint: 'Good KB articles include symptoms, resolution, and prevention.',
    difficulty: 2,
    idealElements: ['specifies document type', 'audience (internal technical team)', 'includes root cause', 'prevention steps', 'verification steps'],
    examplePrompt: {
      prompt: `Create an internal KB article documenting a VPN system extension issue on macOS.

Issue resolved:
- Symptom: GlobalProtect VPN fails to connect on macOS
- Cause: macOS blocking the system extension
- Fix: Approve extension in System Settings > Privacy & Security, restart VPN client
- Root cause: Missing PPPC profile in MDM configuration

KB article should include:
- Symptoms (how the issue presents to user and tech)
- Step-by-step resolution procedure
- Root cause explanation
- Prevention (what MDM config prevents this)
- How to verify the fix worked

Audience: Internal technical team (assume macOS familiarity)
Format: Standard KB format with clear headings`,
      breakdown: {
        context: 'Provides complete resolution details including symptom, fix, and root cause.',
        taskClarity: 'Requests a KB article with five specific sections clearly defined.',
        constraintsFormat: 'Specifies audience technical level and format requirement.',
        aupAwareness: 'No client names, user names, or specific MDM tenant details.',
        practicalValue: 'Including root cause and prevention turns a one-time fix into process improvement.'
      }
    }
  },
  {
    id: 'doc-002',
    category: 'documentation',
    title: 'New User Onboarding Checklist',
    situation: 'Your team needs a standardized checklist for onboarding new employees at client companies. The process involves creating accounts in Microsoft 365, assigning licenses, adding to security groups, setting up email signatures, and configuring MFA. Different clients have different requirements.',
    difficulty: 2,
    idealElements: ['structured checklist format', 'customizable sections', 'verification steps', 'common variations noted'],
    examplePrompt: {
      prompt: `Create a standardized new user onboarding checklist template for MSP use.

Standard tasks to include:
- M365 account creation
- License assignment
- Security group membership
- Email signature setup
- MFA configuration

Requirements:
- Must work across different clients (note where client-specific variations occur)
- Include verification step for each task
- Format as a printable/checkable list
- Add notes field for client-specific instructions
- Include estimated time for each step

Audience: Service desk technicians
Format: Checklist with checkboxes, organized by phase`,
      breakdown: {
        context: 'Lists the standard tasks and notes the multi-client requirement.',
        taskClarity: 'Requests a checklist template with five specific features.',
        constraintsFormat: 'Specifies format (printable checklist), audience, and organization by phase.',
        aupAwareness: 'Generic template with no client-specific information.',
        practicalValue: 'Including verification steps and time estimates improves quality and planning.'
      }
    }
  },
  {
    id: 'doc-003',
    category: 'documentation',
    title: 'Conditional Access Policy Documentation',
    situation: 'You\'ve configured 5 conditional access policies for a client: require MFA for all users, block legacy authentication, require compliant devices for sensitive apps, location-based restrictions, and sign-in risk policies. You need to document these for the client\'s IT manager.',
    difficulty: 3,
    idealElements: ['policy names and purposes', 'what each policy does', 'who it affects', 'exceptions', 'testing notes'],
    examplePrompt: {
      prompt: `Create documentation of Conditional Access policies for a client's IT manager.

Policies configured:
1. Require MFA for all users
2. Block legacy authentication
3. Require compliant devices for sensitive apps
4. Location-based access restrictions
5. Sign-in risk-based policies

For each policy, document:
- Policy name and purpose (business justification)
- What it does (conditions and controls)
- Who/what it affects (users, apps, devices)
- Any exceptions configured
- How it was tested

Audience: Client IT manager (technical but not Entra ID expert)
Format: Table or structured list for easy reference
Include: Recommendations for ongoing management`,
      breakdown: {
        context: 'Lists all five policies that need documentation.',
        taskClarity: 'Specifies five elements to document for each policy.',
        constraintsFormat: 'Defines audience technical level and suggests format.',
        aupAwareness: 'No tenant name, specific locations, or user groups named.',
        practicalValue: 'Including testing notes proves the policies were validated before handoff.'
      }
    }
  },
  {
    id: 'doc-004',
    category: 'documentation',
    title: 'Incident Postmortem',
    situation: 'Last week, a client experienced a 4-hour email outage due to a misconfigured mail flow rule that was quarantining all inbound email. The root cause was a change made during a security review. You need to write a postmortem document for internal use.',
    roleHint: 'Postmortems should be blameless and focused on systemic improvements.',
    difficulty: 2,
    idealElements: ['timeline of events', 'root cause', 'impact assessment', 'what went well', 'what could improve', 'action items'],
    examplePrompt: {
      prompt: `Write an internal postmortem document for a 4-hour email outage.

Incident summary:
- Duration: 4 hours
- Impact: All inbound email quarantined
- Root cause: Misconfigured mail flow rule during security review
- Resolution: Rule corrected, quarantined mail released

The postmortem should include:
- Incident timeline (detection to resolution)
- Root cause analysis (what happened and why)
- Impact assessment (users affected, business impact)
- What went well in the response
- What could be improved
- Specific action items with owners

Approach: Blameless - focus on process improvements, not individual fault
Audience: Internal team and management
Format: Standard postmortem template structure`,
      breakdown: {
        context: 'Provides incident duration, cause, impact, and resolution summary.',
        taskClarity: 'Lists six specific sections required in the postmortem.',
        constraintsFormat: 'Emphasizes blameless approach and specifies format.',
        aupAwareness: 'No client name, specific rule details, or employee names.',
        practicalValue: 'Action items with owners ensures follow-through on improvements.'
      }
    }
  },
  {
    id: 'doc-005',
    category: 'documentation',
    title: 'Backup Recovery Runbook',
    situation: 'Your team uses Veeam to back up client servers. You need to create a step-by-step runbook for restoring a full server from backup, including how to access the backup console, select the restore point, and verify the restoration. This will be used by on-call technicians.',
    difficulty: 2,
    idealElements: ['step-by-step format', 'includes prerequisites', 'verification steps', 'common issues section', 'emergency contacts'],
    examplePrompt: {
      prompt: `Create a runbook for full server restoration using Veeam Backup.

This runbook will be used by on-call technicians who may not use Veeam daily.

Include:
- Prerequisites (what access/permissions needed)
- Step-by-step procedure with screenshots described
- How to select the correct restore point
- Verification steps to confirm successful restore
- Common issues and their solutions
- Escalation contacts if restore fails

Format requirements:
- Numbered steps that can be followed under pressure
- Clear decision points (if X, do Y)
- Estimated time for each major phase
- Rollback procedure if something goes wrong

Audience: On-call technicians (varying Veeam experience)`,
      breakdown: {
        context: 'Specifies the tool (Veeam), audience (on-call techs), and the scenario (full server restore).',
        taskClarity: 'Lists six specific sections the runbook must include.',
        constraintsFormat: 'Details format requirements including numbered steps, decision points, and time estimates.',
        aupAwareness: 'No server names, backup locations, or credential details.',
        practicalValue: 'The "under pressure" consideration ensures the doc is usable in emergencies.'
      }
    }
  },
  {
    id: 'doc-006',
    category: 'documentation',
    title: 'Client Network Diagram Update',
    situation: 'A client just added a new branch office with its own firewall, switch, and 15 workstations connected via site-to-site VPN to headquarters. You need to update their network documentation to reflect this addition, including IP addressing and key device information.',
    difficulty: 1,
    idealElements: ['diagram description', 'IP addressing scheme', 'device inventory', 'connection details', 'update notes'],
    examplePrompt: {
      prompt: `Create documentation for a new branch office network addition.

New branch details:
- Connected to HQ via site-to-site VPN
- Has its own firewall and switch
- 15 workstations
- Needs its own IP subnet

Documentation needed:
- Network diagram description (text-based for now)
- IP addressing scheme for the branch
- Device inventory table (firewall, switch, key specs)
- VPN tunnel configuration summary
- How this connects to existing HQ network

Format: Text-based documentation that could inform a visual diagram later
Include: Placeholder fields for specific IPs/serials to be filled in`,
      breakdown: {
        context: 'Describes the new branch components and its relationship to HQ.',
        taskClarity: 'Lists five specific documentation components needed.',
        constraintsFormat: 'Specifies text-based format with placeholders for sensitive details.',
        aupAwareness: 'Uses placeholders instead of real IPs, no client or location names.',
        practicalValue: 'Placeholder approach creates a template while protecting sensitive data.'
      }
    }
  },
  {
    id: 'doc-007',
    category: 'documentation',
    title: 'Software Installation SOP',
    situation: 'Your team frequently installs a specific line-of-business application (an accounting software) at client sites. The installation has several gotchas: specific .NET version required, SQL Server configuration, firewall exceptions, and license activation. You need to create an SOP.',
    roleHint: 'SOPs should be detailed enough for any technician to follow.',
    difficulty: 2,
    idealElements: ['prerequisites listed', 'step-by-step instructions', 'configuration details', 'troubleshooting tips', 'verification steps'],
    examplePrompt: {
      prompt: `Create an SOP for installing a line-of-business accounting application.

Known requirements/gotchas:
- Specific .NET Framework version required
- SQL Server configuration needed
- Firewall exceptions must be created
- License activation process

The SOP should include:
- Prerequisites checklist (run before starting)
- Step-by-step installation procedure
- Configuration steps post-installation
- Common installation errors and fixes
- Verification that installation succeeded
- Client handoff checklist

Audience: Any technician (may be first time installing this app)
Format: Numbered steps with sub-steps where needed
Include: Time estimate and rollback procedure`,
      breakdown: {
        context: 'Lists the known technical requirements and gotchas.',
        taskClarity: 'Specifies six sections the SOP must contain.',
        constraintsFormat: 'Defines audience (first-time installer), format, and additional requirements.',
        aupAwareness: 'Generic "accounting application" without naming specific software.',
        practicalValue: 'The "first time installing" audience requirement ensures sufficient detail.'
      }
    }
  },
  {
    id: 'doc-008',
    category: 'documentation',
    title: 'Security Audit Findings Report',
    situation: 'You completed a security audit for a client and found: 15 accounts with no MFA, 3 admin accounts being used for daily work, legacy authentication still enabled, and no conditional access policies. You need to create a findings report with recommendations prioritized by risk.',
    difficulty: 3,
    idealElements: ['executive summary', 'findings categorized by severity', 'specific recommendations', 'risk explanations', 'remediation steps'],
    examplePrompt: {
      prompt: `Create a security audit findings report for a client.

Findings:
- 15 user accounts without MFA enabled
- 3 admin accounts used for daily work (not dedicated)
- Legacy authentication protocols still enabled
- No conditional access policies configured

Report requirements:
- Executive summary (1 paragraph for leadership)
- Findings organized by risk level (Critical/High/Medium/Low)
- For each finding: description, risk explanation, remediation steps
- Prioritized action plan (what to fix first)
- Estimated effort for each remediation

Audience: Client IT manager and executive leadership
Tone: Professional, advisory (not alarmist)
Format: Formal report structure with clear sections`,
      breakdown: {
        context: 'Lists all four specific findings from the audit.',
        taskClarity: 'Specifies five components the report must include.',
        constraintsFormat: 'Defines dual audience, tone, and formal report structure.',
        aupAwareness: 'No client name, specific account names, or tenant details.',
        practicalValue: 'Risk-prioritized format helps client allocate limited resources effectively.'
      }
    }
  },
  {
    id: 'doc-009',
    category: 'documentation',
    title: 'Password Reset Self-Service Guide',
    situation: 'A client has enabled self-service password reset (SSPR) in Entra ID. You need to create an end-user guide explaining how employees can reset their own passwords when locked out, including registration and the actual reset process.',
    difficulty: 1,
    idealElements: ['non-technical language', 'screenshots described', 'step-by-step', 'common issues', 'when to contact support'],
    examplePrompt: {
      prompt: `Create an end-user guide for self-service password reset.

The guide covers:
1. One-time registration for SSPR (setting up phone/email)
2. How to reset your password when locked out
3. What to do if SSPR doesn't work

Requirements:
- Written for non-technical employees
- Step-by-step with clear numbered instructions
- Describe what the screen looks like at each step (for future screenshots)
- Include common "gotchas" and how to avoid them
- Clear guidance on when to contact IT support instead

Tone: Friendly, encouraging (password resets are stressful)
Format: Two sections - Setup (one-time) and Reset (when needed)
Length: Keep it brief - people read this when frustrated`,
      breakdown: {
        context: 'Identifies the two processes (registration and reset) that need documentation.',
        taskClarity: 'Lists three topics to cover with five specific requirements.',
        constraintsFormat: 'Specifies audience, tone, format, and length considerations.',
        aupAwareness: 'No client-specific URLs, branding, or contact details.',
        practicalValue: 'The "when frustrated" insight ensures concise, scannable content.'
      }
    }
  },
  {
    id: 'doc-010',
    category: 'documentation',
    title: 'Firewall Change Request Template',
    situation: 'Your team needs a standardized template for firewall change requests that captures all necessary information: source, destination, ports, protocol, business justification, requestor, approver, and implementation date. This will be used across multiple clients.',
    difficulty: 1,
    idealElements: ['all required fields', 'clear format', 'approval workflow', 'rollback plan section', 'implementation notes'],
    examplePrompt: {
      prompt: `Create a standardized firewall change request template.

Required fields:
- Source (IP/subnet/any)
- Destination (IP/subnet/any)
- Port(s) and protocol
- Business justification
- Requestor and approver
- Requested implementation date

Additional sections needed:
- Risk assessment (what could go wrong)
- Rollback plan (how to undo if issues)
- Testing/verification steps
- Implementation notes for the engineer

Requirements:
- Works across multiple clients (generic template)
- Clear enough that requestors fill it out correctly
- Includes approval signature lines
- Can be submitted via email or ticketing system

Format: Form-style with labeled fields`,
      breakdown: {
        context: 'Lists all required data fields for the change request.',
        taskClarity: 'Specifies additional sections and four format requirements.',
        constraintsFormat: 'Requests form-style format that works across clients and submission methods.',
        aupAwareness: 'Generic template without client-specific fields.',
        practicalValue: 'Rollback plan requirement prevents changes without an exit strategy.'
      }
    }
  },
  {
    id: 'doc-011',
    category: 'documentation',
    title: 'Disaster Recovery Plan Section',
    situation: 'You need to write the "Communication Plan" section of a client\'s disaster recovery plan. This should cover who gets notified during different types of incidents, contact methods, escalation paths, and templates for status updates.',
    difficulty: 3,
    idealElements: ['contact hierarchy', 'escalation criteria', 'communication methods', 'update frequency', 'template examples'],
    examplePrompt: {
      prompt: `Write the Communication Plan section of a disaster recovery plan.

This section needs to cover:
- Who gets notified for different incident severities
- Contact methods (primary and backup)
- Escalation paths and timing
- Status update frequency requirements
- Template for status update communications

Include:
- Tiered notification matrix (Sev 1/2/3 → who gets called)
- Contact tree structure
- Sample status update template
- Guidelines for external communication (customers, vendors)
- Post-incident communication requirements

Audience: DR plan will be used by IT team during actual incidents
Format: Must be usable under pressure - clear, scannable, no ambiguity`,
      breakdown: {
        context: 'Specifies this is one section of a larger DR plan focused on communications.',
        taskClarity: 'Lists five topics to cover with five specific inclusions.',
        constraintsFormat: 'Emphasizes "usable under pressure" design principle.',
        aupAwareness: 'Template structure without real contact information.',
        practicalValue: 'The "under pressure" requirement ensures practical, not theoretical, documentation.'
      }
    }
  },
  {
    id: 'doc-012',
    category: 'documentation',
    title: 'Offboarding Procedure',
    situation: 'An employee is leaving a client company under difficult circumstances (termination). You need to document the immediate actions required: disable account, revoke sessions, block sign-in, forward email, transfer OneDrive, remove from groups, and preserve mailbox for legal hold.',
    roleHint: 'Termination procedures need to be fast and thorough.',
    difficulty: 2,
    idealElements: ['priority-ordered steps', 'timing considerations', 'legal/compliance notes', 'verification steps', 'documentation requirements'],
    examplePrompt: {
      prompt: `Create an urgent offboarding procedure for employee terminations.

Actions required:
- Disable account immediately
- Revoke all active sessions
- Block sign-in
- Set up email forwarding
- Transfer OneDrive ownership
- Remove from all groups
- Preserve mailbox for legal hold

Document requirements:
- Steps ordered by priority (security first)
- Timing guidance (what must happen within 15 min, 1 hour, 24 hours)
- Verification for each step (how to confirm it worked)
- Compliance notes (legal hold, data retention)
- Documentation checklist (what to record for HR/legal)

Audience: IT admin executing under time pressure
Format: Checklist with time-based phases`,
      breakdown: {
        context: 'Lists all required offboarding actions and notes the urgency.',
        taskClarity: 'Specifies five document requirements beyond the action list.',
        constraintsFormat: 'Requests time-phased checklist format for urgent execution.',
        aupAwareness: 'No employee name, client name, or specific account details.',
        practicalValue: 'Time-phased approach (15 min/1 hour/24 hours) ensures critical security steps happen first.'
      }
    }
  },

  // ========== RESEARCH (12 scenarios) ==========
  {
    id: 'res-001',
    category: 'research',
    title: 'Conditional Access Deep Dive',
    situation: 'You\'ve been assigned a ticket that involves a conditional access policy blocking a user, but you haven\'t worked with conditional access policies before. You need to understand what they are and how they work before you can troubleshoot.',
    roleHint: 'State your current knowledge level when learning something new.',
    difficulty: 1,
    idealElements: ['states current knowledge level', 'asks for practical explanation', 'requests real-world examples', 'specifies MSP/service desk context'],
    examplePrompt: {
      prompt: `I need to learn about Conditional Access policies in Microsoft Entra ID to troubleshoot a user access issue.

My current knowledge: I understand basic M365 administration but haven't worked with Conditional Access before. I know it's related to controlling access based on conditions, but I don't know the specifics.

Please explain:
1. What Conditional Access policies are and why organizations use them
2. The basic components (conditions, controls, assignments)
3. Common policies I'll encounter in an MSP environment
4. How to identify when CA is blocking a user vs. other issues
5. Where to look in the admin portal to troubleshoot

Context: I'm a service desk technician at an MSP supporting multiple clients.
Level: Practical understanding for troubleshooting, not deep implementation knowledge.`,
      breakdown: {
        context: 'States current knowledge level honestly and provides role context (MSP service desk).',
        taskClarity: 'Five specific questions covering concepts through troubleshooting.',
        constraintsFormat: 'Specifies desired depth (practical troubleshooting, not deep implementation).',
        aupAwareness: 'No client-specific details or tenant information.',
        practicalValue: 'The "MSP environment" context will yield relevant real-world examples.'
      }
    }
  },
  {
    id: 'res-002',
    category: 'research',
    title: 'DMARC Implementation',
    situation: 'A client asked about implementing DMARC for their email domain. You know it\'s related to email authentication but aren\'t clear on how it works with SPF and DKIM, or what the implementation process involves. The client wants a recommendation by end of week.',
    difficulty: 2,
    idealElements: ['asks for relationship between SPF/DKIM/DMARC', 'implementation steps', 'common pitfalls', 'monitoring recommendations'],
    examplePrompt: {
      prompt: `I need to understand DMARC well enough to advise a client on implementation.

My current knowledge: I know SPF and DKIM exist and are related to email authentication, but I'm not clear on how DMARC ties them together or what the implementation process looks like.

Please explain:
1. How DMARC works with SPF and DKIM (the relationship)
2. The implementation process from start to finish
3. What "enforcement levels" mean (none, quarantine, reject)
4. Common mistakes that break legitimate email
5. How to monitor and adjust after implementation

I need to give the client a recommendation by end of week, so focus on practical implementation guidance rather than deep technical theory.`,
      breakdown: {
        context: 'States current knowledge, client timeline, and the practical goal (give recommendation).',
        taskClarity: 'Five specific questions progressing from concepts to implementation to monitoring.',
        constraintsFormat: 'Requests practical guidance over deep theory due to time constraint.',
        aupAwareness: 'No client domain or specific DNS details.',
        practicalValue: 'The timeline pressure ensures focused, actionable response.'
      }
    }
  },
  {
    id: 'res-003',
    category: 'research',
    title: 'Windows Autopilot Overview',
    situation: 'Your company is considering using Windows Autopilot for device provisioning instead of traditional imaging. Your manager asked you to research what Autopilot is, what\'s required to implement it, and what the benefits and limitations are.',
    difficulty: 2,
    idealElements: ['asks for comparison with traditional imaging', 'prerequisites', 'benefits and limitations', 'implementation considerations'],
    examplePrompt: {
      prompt: `I need to research Windows Autopilot for a potential implementation at our MSP.

Context: We currently use traditional imaging (MDT/SCCM) for device provisioning. Management wants to understand if Autopilot would be better for our client deployments.

Please provide:
1. What Autopilot is and how it differs from traditional imaging
2. Prerequisites for implementation (licensing, infrastructure, Intune)
3. Benefits for an MSP model (multiple clients)
4. Limitations and scenarios where it's NOT the right choice
5. What the user experience looks like (first boot to ready-to-use)
6. Rough implementation effort comparison vs. maintaining imaging infrastructure

I need to present pros/cons to management, so balanced analysis is more valuable than advocacy.`,
      breakdown: {
        context: 'Describes current state (traditional imaging) and purpose (MSP evaluation).',
        taskClarity: 'Six specific questions covering full evaluation scope.',
        constraintsFormat: 'Requests balanced analysis for management presentation.',
        aupAwareness: 'No specific client or infrastructure details.',
        practicalValue: 'The "MSP model" context will yield multi-tenant considerations.'
      }
    }
  },
  {
    id: 'res-004',
    category: 'research',
    title: 'Zero Trust Architecture',
    situation: 'A client\'s IT director mentioned wanting to move toward "zero trust" security. You\'ve heard the term but aren\'t sure what it means in practical terms or what changes it would require to their current setup (traditional on-prem AD with M365).',
    roleHint: 'Ask for practical implementation guidance, not just theory.',
    difficulty: 3,
    idealElements: ['asks for principles explanation', 'practical implementation steps', 'how it applies to their environment', 'where to start'],
    examplePrompt: {
      prompt: `A client's IT director wants to move toward "zero trust" security. I need to understand what this means practically for their environment.

Client's current setup:
- Traditional on-premises Active Directory
- Microsoft 365 for email and collaboration
- Mix of on-prem and cloud applications
- VPN for remote access

I need to understand:
1. What "zero trust" actually means (core principles, not buzzwords)
2. How it would change their current architecture
3. Practical first steps they could take (quick wins)
4. Longer-term changes required for full zero trust
5. How M365 features (Conditional Access, Intune) fit into zero trust

Please focus on practical implementation rather than theoretical frameworks. What would actually change in their day-to-day IT operations?`,
      breakdown: {
        context: 'Describes client\'s current environment specifically to get relevant guidance.',
        taskClarity: 'Five specific questions from principles to practical implementation.',
        constraintsFormat: 'Explicitly requests practical focus over theoretical frameworks.',
        aupAwareness: 'No client name or specific system details.',
        practicalValue: 'Describing current state (on-prem AD + M365) enables specific migration guidance.'
      }
    }
  },
  {
    id: 'res-005',
    category: 'research',
    title: 'Microsoft Defender for Endpoint',
    situation: 'Your company is evaluating Microsoft Defender for Endpoint as a replacement for the current third-party antivirus. You need to understand what it includes, how it differs from standard Windows Defender, and what licensing is required.',
    difficulty: 1,
    idealElements: ['feature comparison', 'licensing requirements', 'deployment considerations', 'management interface'],
    examplePrompt: {
      prompt: `I need to evaluate Microsoft Defender for Endpoint as a potential replacement for our current third-party antivirus solution.

Current state: Using a traditional AV product across client environments. Considering MDE for consolidation with M365.

Please explain:
1. What MDE includes vs. standard Windows Defender (the free built-in version)
2. Key features that justify the cost (EDR, threat analytics, etc.)
3. Licensing requirements (which M365 plans include it)
4. How it's deployed and managed (Intune integration)
5. Limitations or gaps compared to dedicated EDR solutions

Context: MSP evaluating for multiple clients, so scalability and multi-tenant management matter.`,
      breakdown: {
        context: 'States current state, evaluation purpose, and MSP context.',
        taskClarity: 'Five specific questions covering features, licensing, deployment, and limitations.',
        constraintsFormat: 'Notes MSP scalability requirement.',
        aupAwareness: 'No specific client or product names.',
        practicalValue: 'Comparing to "dedicated EDR solutions" provides competitive context.'
      }
    }
  },
  {
    id: 'res-006',
    category: 'research',
    title: 'Azure AD B2B vs B2C',
    situation: 'A client wants to give external partners access to a SharePoint site and also wants to build a customer portal. Someone mentioned Azure AD B2B and B2C as options. You need to understand the difference and which applies to each scenario.',
    difficulty: 2,
    idealElements: ['clear distinction between B2B and B2C', 'use case mapping', 'implementation differences', 'licensing considerations'],
    examplePrompt: {
      prompt: `I need to understand Azure AD B2B vs B2C to advise a client on two different scenarios.

Scenario 1: Give external business partners access to a SharePoint site
Scenario 2: Build a customer portal where customers create their own accounts

I've heard B2B and B2C mentioned but I'm not clear on the distinction.

Please explain:
1. The fundamental difference between B2B and B2C (purpose and design)
2. Which applies to each of my client's scenarios and why
3. How users authenticate in each model
4. Licensing and cost implications
5. Implementation complexity comparison

Keep the explanation practical - I need to recommend the right approach for each scenario, not become an identity expert.`,
      breakdown: {
        context: 'Presents two specific scenarios to map to the correct solution.',
        taskClarity: 'Five questions covering distinction, mapping, authentication, licensing, and complexity.',
        constraintsFormat: 'Requests practical recommendation focus.',
        aupAwareness: 'No client name or specific portal details.',
        practicalValue: 'Having two concrete scenarios ensures applicable guidance.'
      }
    }
  },
  {
    id: 'res-007',
    category: 'research',
    title: 'PowerShell for Exchange Online',
    situation: 'You\'ve been using the Exchange admin center GUI but need to start using PowerShell for bulk operations. You\'re comfortable with basic PowerShell but haven\'t connected to Exchange Online before or used Exchange-specific cmdlets.',
    roleHint: 'Be specific about your current skill level.',
    difficulty: 1,
    idealElements: ['connection methods', 'common cmdlets for MSP tasks', 'practical examples', 'error handling tips'],
    examplePrompt: {
      prompt: `I need to learn Exchange Online PowerShell for bulk operations.

My current skills:
- Comfortable with basic PowerShell (variables, loops, piping)
- Use the Exchange admin center GUI daily
- Never connected to Exchange Online via PowerShell

Please help me with:
1. How to connect to Exchange Online (modern auth method)
2. The most useful cmdlets for common MSP tasks:
   - Mailbox management (create, modify, permissions)
   - Distribution group management
   - Mail flow rule queries
3. Example scripts for bulk operations (e.g., add users to a group)
4. Common errors and how to troubleshoot them
5. Best practices for multi-tenant MSP use

Focus on practical, immediately usable examples rather than comprehensive documentation.`,
      breakdown: {
        context: 'Clearly states current skill level and gap (GUI experience, no PowerShell EXO).',
        taskClarity: 'Five specific areas with detailed sub-topics for cmdlets.',
        constraintsFormat: 'Requests practical examples over comprehensive documentation.',
        aupAwareness: 'No tenant names or specific mailbox details.',
        practicalValue: 'Listing specific task areas (mailbox, groups, rules) yields targeted cmdlet guidance.'
      }
    }
  },
  {
    id: 'res-008',
    category: 'research',
    title: 'Intune App Protection Policies',
    situation: 'A client wants to allow employees to access company email on personal phones but is worried about data leakage. Someone mentioned Intune App Protection Policies as a solution. You need to understand what they do and how they\'re different from device enrollment.',
    difficulty: 2,
    idealElements: ['explains MAM vs MDM', 'what APP can control', 'deployment scenarios', 'user experience impact'],
    examplePrompt: {
      prompt: `A client wants employees to use personal phones for company email but is concerned about data security. I need to understand Intune App Protection Policies.

Client requirement: Access email on personal phones without full device management
Concern: Preventing company data from leaking to personal apps

Please explain:
1. What App Protection Policies (APP) are and how they differ from full device enrollment (MDM)
2. What specifically APP can control (copy/paste, save to, etc.)
3. The user experience on a personal phone with APP applied
4. Scenarios where APP is sufficient vs. when full MDM is needed
5. How to deploy APP without requiring device enrollment

I need to explain the options to a non-technical client stakeholder, so please include how to communicate the tradeoffs simply.`,
      breakdown: {
        context: 'States client requirement (BYOD email) and specific concern (data leakage).',
        taskClarity: 'Five questions covering capabilities, user experience, and deployment.',
        constraintsFormat: 'Requests client communication guidance for non-technical stakeholder.',
        aupAwareness: 'No client name or specific device details.',
        practicalValue: 'The "explain to non-technical stakeholder" request yields communication-ready content.'
      }
    }
  },
  {
    id: 'res-009',
    category: 'research',
    title: 'Microsoft Graph API Basics',
    situation: 'You want to start automating some M365 tasks using the Microsoft Graph API but have no experience with APIs. You need a beginner-friendly explanation of what Graph is, how to authenticate, and how to make basic calls.',
    roleHint: 'Indicate you\'re new to APIs in general.',
    difficulty: 2,
    idealElements: ['explains API concepts simply', 'authentication methods', 'first steps to try', 'practical examples'],
    examplePrompt: {
      prompt: `I want to learn Microsoft Graph API for M365 automation, but I'm new to APIs in general.

My current skills:
- Experienced with PowerShell scripting
- Comfortable in M365 admin centers
- No experience with REST APIs or Graph specifically

Please explain in beginner-friendly terms:
1. What Microsoft Graph API is and why I'd use it over PowerShell modules
2. How authentication works (app registrations, permissions - ELI5)
3. The simplest possible first API call I can try (with step-by-step)
4. How to translate a Graph call into a PowerShell script
5. Resources for continued learning

I learn best by doing, so a simple hands-on example would be more valuable than theoretical explanation.`,
      breakdown: {
        context: 'States PowerShell experience but API inexperience clearly.',
        taskClarity: 'Five questions progressing from concepts to hands-on example.',
        constraintsFormat: 'Requests beginner-friendly, hands-on approach.',
        aupAwareness: 'No tenant or app registration details.',
        practicalValue: 'The "ELI5" request for authentication ensures accessible explanation.'
      }
    }
  },
  {
    id: 'res-010',
    category: 'research',
    title: 'Hybrid Azure AD Join',
    situation: 'A client with on-premises Active Directory wants to understand what Hybrid Azure AD Join is and whether they should implement it. They currently have Azure AD Connect for identity sync but devices are only domain-joined, not Azure AD joined.',
    difficulty: 3,
    idealElements: ['explains hybrid join concept', 'benefits for their scenario', 'prerequisites', 'implementation approach'],
    examplePrompt: {
      prompt: `A client is asking about Hybrid Azure AD Join. I need to understand it well enough to make a recommendation.

Client's current state:
- On-premises Active Directory
- Azure AD Connect configured for identity sync
- Windows devices are domain-joined only (not Azure AD joined)
- Using M365 for email and some cloud apps

Questions I need answered:
1. What Hybrid Azure AD Join actually does (vs. pure domain join or pure Azure AD join)
2. What benefits it would provide for this client specifically
3. Prerequisites and requirements for implementation
4. Implementation approach and potential gotchas
5. How it enables features like Conditional Access and Intune

The client is risk-averse, so I need to understand what could go wrong and how to mitigate.`,
      breakdown: {
        context: 'Describes client\'s current state precisely to get relevant guidance.',
        taskClarity: 'Five specific questions plus risk consideration.',
        constraintsFormat: 'Notes client is risk-averse, requiring gotcha/mitigation coverage.',
        aupAwareness: 'No client name or domain details.',
        practicalValue: 'The current state details enable specific migration guidance.'
      }
    }
  },
  {
    id: 'res-011',
    category: 'research',
    title: 'Email Retention Policies',
    situation: 'A client in a regulated industry (healthcare) asked about email retention requirements. You need to understand the difference between Microsoft 365 retention policies, litigation hold, and archive mailboxes, and how they might apply to compliance requirements.',
    difficulty: 2,
    idealElements: ['explains each retention option', 'compliance scenarios', 'how they interact', 'implementation recommendations'],
    examplePrompt: {
      prompt: `A healthcare client asked about email retention for compliance. I need to understand the M365 retention options.

Client context:
- Healthcare industry (likely has regulatory retention requirements)
- Using M365 with Exchange Online
- Concerned about both retaining data for compliance AND ability to delete when required

I need to understand:
1. The difference between retention policies, litigation hold, and archive mailboxes
2. Which applies to regulatory compliance (keeping data X years)
3. Which applies to legal holds (preserving data for litigation)
4. How these features interact (can they conflict?)
5. Typical implementation for a healthcare organization

I'll need to involve their compliance team, but I want to understand the technical options first.`,
      breakdown: {
        context: 'Specifies industry (healthcare), platform (M365/EXO), and dual concern (retain AND delete).',
        taskClarity: 'Five questions covering options, use cases, and interaction.',
        constraintsFormat: 'Notes compliance team involvement to set expectation.',
        aupAwareness: 'No client name or specific compliance requirements.',
        practicalValue: 'The dual concern (retain AND delete) is a real complexity this addresses.'
      }
    }
  },
  {
    id: 'res-012',
    category: 'research',
    title: 'Passkeys and Passwordless Authentication',
    situation: 'Your company\'s security team is talking about moving to "passwordless" authentication using passkeys. You\'ve seen passkeys mentioned in Windows and Microsoft 365 but don\'t understand how they work or what\'s needed to implement them.',
    roleHint: 'Ask for both the technical explanation and practical implementation path.',
    difficulty: 2,
    idealElements: ['explains passkey technology', 'Microsoft implementation options', 'prerequisites', 'migration path from passwords'],
    examplePrompt: {
      prompt: `Our security team wants to move toward passwordless authentication with passkeys. I need to understand what this involves.

Current state: Traditional passwords with MFA (Microsoft Authenticator) for M365
Goal: Understand passkeys and passwordless options

Please explain:
1. What passkeys are and how they work (technical but accessible)
2. Microsoft's passwordless options (Windows Hello, FIDO2, Authenticator app)
3. How passkeys relate to/differ from these options
4. Prerequisites for implementation (Entra ID, device requirements)
5. Practical migration path (how do you transition users from passwords?)
6. Security benefits and any limitations/gotchas

I need to understand both the technology and the practical implementation path for an MSP managing multiple clients.`,
      breakdown: {
        context: 'States current state (passwords + MFA) and MSP context.',
        taskClarity: 'Six questions covering technology, options, prerequisites, and migration.',
        constraintsFormat: 'Requests both technical explanation and practical implementation path.',
        aupAwareness: 'No specific client or tenant details.',
        practicalValue: 'The migration path question addresses the real challenge of transitioning existing users.'
      }
    }
  },
];
