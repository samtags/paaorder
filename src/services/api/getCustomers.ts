export interface Customer {
  customerId: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
}

interface Response {
  customers: Customer[];
}

export default async function getCustomers() {
  const fetchResponse = await fetch(
    'https://run.mocky.io/v3/60ed967d-275d-45cd-9996-a38ee5cc4a1a',
  );

  const response = (await fetchResponse.json()) as Response;
  const customers = response.customers;

  return customers;
}
