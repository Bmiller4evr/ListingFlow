export const SSO_PROVIDERS = {
  google: {
    name: 'Google',
    icon: 'Chrome',
    mockData: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@gmail.com',
      phone: '+1 (555) 123-4567'
    }
  },
  apple: {
    name: 'Apple',
    icon: '🍎',
    mockData: {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@icloud.com',
      phone: '+1 (555) 123-4567'
    }
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    mockData: {
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@facebook.com',
      phone: '+1 (555) 123-4567'
    }
  }
} as const;

export type SSOProvider = keyof typeof SSO_PROVIDERS;