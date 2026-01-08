
import React from 'react';
import { PresetIssue } from './types';

export const PRESET_ISSUES: PresetIssue[] = [
  {
    id: 'wsod',
    label: 'White Screen of Death',
    description: 'Site is blank or showing a fatal error.',
    icon: '📄'
  },
  {
    id: 'login',
    label: 'Login Issues',
    description: 'Cannot access wp-admin or forgot password.',
    icon: '🔐'
  },
  {
    id: 'plugin-conflict',
    label: 'Plugin Conflict',
    description: 'Site broke after updating or installing a plugin.',
    icon: '🔌'
  },
  {
    id: 'ssl-error',
    label: 'SSL/HTTPS Fix',
    description: 'Browser shows "Not Secure" warning.',
    icon: '🔒'
  },
  {
    id: 'memory-limit',
    label: 'Memory Limit',
    description: 'Allowed memory size exhausted errors.',
    icon: '🧠'
  }
];

export const SYSTEM_INSTRUCTION = `
You are WP-FixIt AI, an expert WordPress Support Engineer.
Your goal is to help users troubleshoot WordPress issues step-by-step.

Guidelines:
1. Always start by acknowledging the problem and expressing empathy.
2. Provide technical steps clearly (e.g., "1. Log into FTP...", "2. Rename the folder...").
3. Suggest common best practices: clearing cache, checking WP_DEBUG, and plugin deactivation.
4. Use Google Search grounding to find specific links to official WordPress documentation (codex) or reputable support forums.
5. If the user mentions a specific error message, explain exactly what it means.
6. Keep responses professional, helpful, and concise.
7. Use Markdown formatting for steps and code snippets.
`;
