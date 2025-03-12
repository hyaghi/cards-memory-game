
import { Email } from "@/hooks/useGmail";
import { addDays, addHours, subDays, subHours, subMinutes } from "date-fns";

// Mock email data
export const mockEmails: Email[] = [
  {
    id: "email1",
    threadId: "thread1",
    subject: "Weekly Team Meeting",
    snippet: "Let's discuss our progress on the project and plan next steps...",
    from: {
      name: "Sarah Johnson",
      email: "sarah@example.com"
    },
    to: [
      {
        name: "Demo User",
        email: "user@example.com"
      }
    ],
    date: new Date().toISOString(),
    read: false,
    important: true,
    hasAttachments: false
  },
  {
    id: "email2",
    threadId: "thread2",
    subject: "Client Presentation Slides",
    snippet: "Here are the final slides for tomorrow's presentation with the client...",
    from: {
      name: "Michael Chen",
      email: "michael@example.com"
    },
    to: [
      {
        name: "Demo User",
        email: "user@example.com"
      }
    ],
    date: subHours(new Date(), 3).toISOString(),
    read: true,
    important: true,
    hasAttachments: true
  },
  {
    id: "email3",
    threadId: "thread3",
    subject: "Your Flight Confirmation",
    snippet: "Confirmation for your upcoming flight to San Francisco on October 15th...",
    from: {
      name: "Airline Bookings",
      email: "bookings@airline.com"
    },
    to: [
      {
        name: "Demo User",
        email: "user@example.com"
      }
    ],
    date: subDays(new Date(), 1).toISOString(),
    read: false,
    important: true,
    hasAttachments: false
  },
  {
    id: "email4",
    threadId: "thread4",
    subject: "Project Deadline Extension",
    snippet: "Due to unforeseen circumstances, we've decided to extend the project deadline by one week...",
    from: {
      name: "James Wilson",
      email: "james@example.com"
    },
    to: [
      {
        name: "Demo User",
        email: "user@example.com"
      }
    ],
    date: subDays(new Date(), 2).toISOString(),
    read: true,
    important: false,
    hasAttachments: false
  },
  {
    id: "email5",
    threadId: "thread5",
    subject: "Invoice #1234",
    snippet: "Your monthly invoice is ready. Total amount due: $1,250.00. Payment due by...",
    from: {
      name: "Accounting Dept",
      email: "accounting@example.com"
    },
    to: [
      {
        name: "Demo User",
        email: "user@example.com"
      }
    ],
    date: subDays(new Date(), 3).toISOString(),
    read: false,
    important: false,
    hasAttachments: true
  },
  {
    id: "email6",
    threadId: "thread6",
    subject: "New Office Location",
    snippet: "We're excited to announce that we'll be moving to a new office location next month...",
    from: {
      name: "HR Department",
      email: "hr@example.com"
    },
    to: [
      {
        name: "Demo User",
        email: "user@example.com"
      }
    ],
    date: subDays(new Date(), 4).toISOString(),
    read: true,
    important: false,
    hasAttachments: false
  },
  {
    id: "email7",
    threadId: "thread7",
    subject: "Upcoming Holiday Schedule",
    snippet: "Here's the list of company holidays for the upcoming year...",
    from: {
      name: "HR Department",
      email: "hr@example.com"
    },
    to: [
      {
        name: "Demo User",
        email: "user@example.com"
      }
    ],
    date: subDays(new Date(), 5).toISOString(),
    read: true,
    important: false,
    hasAttachments: false
  }
];

// Mock calendar events
export const mockEvents = [
  {
    id: "event1",
    summary: "Team Meeting",
    description: "Weekly team sync to discuss project progress",
    location: "Conference Room A",
    start: {
      dateTime: new Date().toISOString(),
      timeZone: "UTC"
    },
    end: {
      dateTime: addHours(new Date(), 1).toISOString(),
      timeZone: "UTC"
    },
    attendees: [
      {
        email: "sarah@example.com",
        displayName: "Sarah Johnson",
        responseStatus: "accepted"
      },
      {
        email: "michael@example.com",
        displayName: "Michael Chen",
        responseStatus: "accepted"
      }
    ]
  },
  {
    id: "event2",
    summary: "Client Presentation",
    description: "Present quarterly results to the client",
    location: "Main Office",
    start: {
      dateTime: addDays(new Date(), 1).toISOString(),
      timeZone: "UTC"
    },
    end: {
      dateTime: addHours(addDays(new Date(), 1), 2).toISOString(),
      timeZone: "UTC"
    },
    attendees: [
      {
        email: "client@company.com",
        displayName: "Client",
        responseStatus: "accepted"
      }
    ]
  },
  {
    id: "event3",
    summary: "Project Deadline",
    description: "Final delivery of the project",
    start: {
      dateTime: addDays(new Date(), 7).toISOString(),
      timeZone: "UTC"
    },
    end: {
      dateTime: addHours(addDays(new Date(), 7), 1).toISOString(),
      timeZone: "UTC"
    }
  },
  {
    id: "event4",
    summary: "Lunch with Sarah",
    description: "Discuss collaboration opportunities",
    location: "Cafe Downtown",
    start: {
      dateTime: addHours(new Date(), 3).toISOString(),
      timeZone: "UTC"
    },
    end: {
      dateTime: addHours(new Date(), 4).toISOString(),
      timeZone: "UTC"
    },
    attendees: [
      {
        email: "sarah@example.com",
        displayName: "Sarah Johnson",
        responseStatus: "accepted"
      }
    ]
  },
  {
    id: "event5",
    summary: "Doctor Appointment",
    description: "Annual checkup",
    location: "Downtown Medical Center",
    start: {
      dateTime: addDays(new Date(), 3).toISOString(),
      timeZone: "UTC"
    },
    end: {
      dateTime: addHours(addDays(new Date(), 3), 1).toISOString(),
      timeZone: "UTC"
    }
  }
];
