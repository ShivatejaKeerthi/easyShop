import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    const baseTitle = 'EasyShop';
    document.title = title ? `${title} | ${baseTitle}` : baseTitle;
  }, [title]);
}