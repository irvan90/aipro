import { signal } from '@angular/core';

export const uiStore = {
  pageTitle: signal('Dashboard'),
  pageSubtitle: signal('myBCA Mobile · Q3 Planning'),
  isLoading: signal(false),
};
