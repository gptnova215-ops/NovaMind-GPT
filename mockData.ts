
import type { EmailItem, TaskItem, Bot, EncryptedFile, PhoneCallItem, Meeting, SocialMention, BusinessMetric, CognitiveInsight, DirectMessage } from './types';

export const mockEmails: EmailItem[] = [
    {
        id: 'email-1',
        sender: 'Jane Doe (Acme Corp)',
        subject: 'Project Phoenix Update',
        body: 'Hi team, just wanted to check in on the status of the Q3 deliverables for Project Phoenix. Are we still on track for the deadline next Friday? Let me know if there are any blockers.',
        timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
    },
    {
        id: 'email-2',
        sender: 'billing@cloudservice.com',
        subject: 'Your Invoice #8439-22 is due',
        body: 'Dear customer, this is a reminder that your invoice for $49.99 is due on the 25th of this month. Please make a payment at your earliest convenience to avoid service interruption.',
        timestamp: new Date(Date.now() - 3600000 * 8), // 8 hours ago
    },
    {
        id: 'email-3',
        sender: 'John Smith',
        subject: 'Coffee next week?',
        body: 'Hey, it\'s been a while! Are you free to catch up over coffee sometime next week? Let me know what your schedule looks like. Best, John',
        timestamp: new Date(Date.now() - 3600000 * 24), // 1 day ago
    },
    {
        id: 'email-4',
        sender: 'TechCrunch Newsletter',
        subject: 'AI startups raise $500M in new funding round',
        body: 'This week in tech, several prominent AI startups have announced significant funding rounds, signaling continued investor confidence in the sector. Read more inside...',
        timestamp: new Date(Date.now() - 3600000 * 48),
    },
];

export const mockTasks: TaskItem[] = [
    {
        id: 'task-1',
        title: 'Finalize Q3 presentation slides',
        dueDate: 'Tomorrow',
        source: 'Google',
    },
    {
        id: 'task-2',
        title: 'Submit expense report',
        dueDate: 'In 3 days',
        source: 'Microsoft',
    },
    {
        id: 'task-3',
        title: 'Book dentist appointment',
        dueDate: 'This Week',
        source: 'Apple',
    },
    {
        id: 'task-4',
        title: 'Pick up dry cleaning',
        dueDate: 'Today',
        source: 'Microsoft',
    },
    {
        id: 'task-5',
        title: 'Review Project Phoenix draft',
        dueDate: 'Today',
        source: 'Google',
    }
];

export const mockPhoneCalls: PhoneCallItem[] = [
    {
        id: 'call-1',
        contactName: 'Alex Johnson',
        type: 'Incoming',
        duration: '12m 34s',
        timestamp: new Date(Date.now() - 3600000 * 1.5), // 1.5 hours ago
    },
    {
        id: 'call-2',
        contactName: 'Marketing Team',
        type: 'Outgoing',
        duration: '28m 02s',
        timestamp: new Date(Date.now() - 3600000 * 5), // 5 hours ago
    },
    {
        id: 'call-3',
        contactName: 'Unknown Number',
        type: 'Missed',
        duration: 'N/A',
        timestamp: new Date(Date.now() - 3600000 * 22), // 22 hours ago
    }
];

export const mockBots: Bot[] = [
    {
        id: 'bot-1',
        name: 'Market Sentinel',
        specialty: 'Research',
        status: 'Working',
        currentTask: 'Analyze Q2 competitor landscape.',
        log: ['[10:30 AM] Task initiated.', '[10:35 AM] Data ingestion complete.', '[10:40 AM] Beginning sentiment analysis.'],
        progress: 45,
        resultFileId: null,
    },
    {
        id: 'bot-2',
        name: 'Chrono Weaver',
        specialty: 'Scheduling',
        status: 'Completed',
        currentTask: 'Defragment calendar for next week.',
        log: ['[11:15 AM] Task initiated.', '[11:16 AM] Conflicts identified.', '[11:17 AM] Calendar optimized.', '[11:17 AM] Task completed successfully.'],
        progress: 100,
        resultFileId: 'file-result-bot-2',
    },
    {
        id: 'bot-3',
        name: 'Inbox Purifier',
        specialty: 'Email Sorcerer',
        status: 'Paused',
        currentTask: 'Categorize and summarize unread emails from the last 48 hours.',
        log: ['[12:01 PM] Task initiated.', '[12:05 PM] Accessed inbox.', '[12:10 PM] Processing batch 1 of 5.', '[12:15 PM] Paused by user.'],
        progress: 20,
        resultFileId: null,
    }
];

export const mockFiles: EncryptedFile[] = [
    {
        id: 'file-1',
        name: 'q2_market_report.pdf',
        type: 'PDF',
        uploadDate: '2 days ago',
        content: 'This is the content of the Q2 Market Report PDF. It contains detailed analysis and projections.'
    },
    {
        id: 'file-2',
        name: 'meeting_notes_raw.txt',
        type: 'Text',
        uploadDate: '5 hours ago',
        content: 'Meeting Notes:\n- Discussed Project Phoenix timeline.\n- John to follow up on marketing assets.\n- Next sync scheduled for Friday.'
    },
    {
        id: 'file-3',
        name: 'inspirational_quotes.txt',
        type: 'Text',
        uploadDate: '1 week ago',
        content: '"The only way to do great work is to love what you do." - Steve Jobs\n"The journey of a thousand miles begins with a single step." - Lao Tzu'
    },
    {
        id: 'file-result-bot-2',
        name: 'Chrono_Weaver_result.txt',
        type: 'Text',
        uploadDate: 'Just now',
        content: 'Calendar defragmentation report:\n- Identified 4 scheduling conflicts.\n- Rescheduled 2 appointments to optimize focus time.\n- Freed up 3.5 hours of contiguous blocks next week.'
    },
    {
        id: 'file-journal-1',
        name: 'Journal Entry - Today',
        type: 'Journal',
        uploadDate: new Date().toLocaleDateString(),
        content: 'Felt a wave of inspiration this morning during the sunrise. The "Solar" aura reading felt accurate. I need to channel this energy into Project Phoenix today. I also feel a bit of apprehension about the upcoming presentation, which might be the "Ember" harmonics I saw.'
    }
];

export const mockMeetings: Meeting[] = [
    { id: 'meet-1', title: 'Project Phoenix Sync', time: '11:00 AM', participants: ['Jane Doe', 'John Smith'] },
    { id: 'meet-2', title: '1:1 with Manager', time: '2:30 PM', participants: ['Sarah Lee'] },
    { id: 'meet-3', title: 'Q4 Planning Session', time: 'Tomorrow, 9:00 AM', participants: ['Exec Team', 'All Hands'] },
];

export const mockSocialMentions: SocialMention[] = [
    { id: 'sm-1', platform: 'X', author: '@TechInnovator', content: 'The work coming out of the Project Phoenix team is truly next-gen. Excited to see the final product!', url: '#', timestamp: new Date(Date.now() - 3600000 * 3) },
    { id: 'sm-2', platform: 'Web', author: 'AI Weekly', content: 'A Deep Dive into Project Phoenix: Is This the Future of AI Companionship?', url: '#', timestamp: new Date(Date.now() - 3600000 * 25) },
    { id: 'sm-3', platform: 'X', author: '@DesignDaily', content: 'Loving the UI mockups for the new NovaMind interface. Clean, intuitive, and human-centric.', url: '#', timestamp: new Date(Date.now() - 3600000 * 50) },
];

export const mockBusinessMetrics: BusinessMetric[] = [
    { id: 'bm-1', label: 'Team Velocity', value: '28 pts', change: 12 },
    { id: 'bm-2', label: 'Q3 Revenue Target', value: '78%', change: 2 },
    { id: 'bm-3', label: 'User Engagement', value: '4.2k DAU', change: -3 },
    { id: 'bm-4', label: 'System Uptime', value: '99.98%', change: 0.01 },
];

export const mockCognitiveInsights: CognitiveInsight[] = [
    {
        id: 'insight-1',
        timestamp: new Date(),
        type: 'opportunity',
        title: 'Synthesize Meeting Notes',
        description: 'You have a raw text file of meeting notes. I can deploy a bot to summarize the key points and action items for you.',
        color: 'emerald-400',
        action: {
            label: 'Deploy Summarizer Bot',
            type: 'explore_in_chat',
            prompt: 'Deploy a bot to summarize my "meeting_notes_raw.txt" file.'
        }
    },
    {
        id: 'insight-2',
        timestamp: new Date(Date.now() - 3600000),
        type: 'pattern',
        title: 'Afternoon Focus Dip',
        description: 'I\'ve noticed your focus metric tends to decrease around 2 PM. A short break or mindfulness exercise might help maintain your energy levels.',
        color: 'amber-400',
        action: {
            label: 'Explore Mindfulness',
            type: 'explore_in_chat',
            prompt: 'Tell me about some quick mindfulness exercises I can do in the afternoon.'
        }
    },
];

export const mockMessages: DirectMessage[] = [
    {
        id: 'dm-1',
        contactName: 'Aria',
        contactUsername: 'aria@novamind.ai',
        lastMessage: 'Just saw the latest consciousness model updates. Incredible stuff!',
        timestamp: new Date(Date.now() - 3600000 * 1),
        unreadCount: 2,
    },
    {
        id: 'dm-2',
        contactName: 'Kael',
        contactUsername: 'kael@novamind.ai',
        lastMessage: 'Are you free to sync on Project Chimera tomorrow?',
        timestamp: new Date(Date.now() - 3600000 * 5),
        unreadCount: 0,
    },
];
