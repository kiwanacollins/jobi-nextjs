export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
  params?: { id: string };
}

export interface IServerResponse {
  status: string;
  message: string;
  data: any;
}
