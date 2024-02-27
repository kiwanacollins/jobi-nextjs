export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

export interface IServerResponse {
  status: string;
  message: string;
  data: any;
}
