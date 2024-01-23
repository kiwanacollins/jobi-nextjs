import qs from 'query-string';

export const animationCreate = () => {
  if (typeof window !== 'undefined') {
    import('wowjs').then((module) => {
      const WOW = module.default;
      new WOW.WOW({ live: false }).init();
    });
  }
};

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window?.location?.pathname || '',
      query: currentUrl
    },
    { skipNull: true }
  );
};

interface removeUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({
  params,
  keysToRemove
}: removeUrlQueryParams) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window?.location?.pathname || '',
      query: currentUrl
    },
    { skipNull: true }
  );
};
