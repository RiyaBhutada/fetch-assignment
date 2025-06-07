const BASE_URL = "https://frontend-take-home-service.fetch.com";

export async function login(name: string, email: string) {
  await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
}

export async function fetchBreeds(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/dogs/breeds`, {
    credentials: "include",
  });
  return res.json();
}

export async function searchDogs(
  breeds: string[],
  from = 0,
  sort = "breed:asc"
) {
  const query = new URLSearchParams({
    sort,
    size: "10",
    from: from.toString(),
  });
  breeds.forEach((breed) => query.append("breeds", breed));

  const res = await fetch(`${BASE_URL}/dogs/search?${query}`, {
    credentials: "include",
  });
  return res.json();
}

export async function fetchDogs(ids: string[]) {
  const res = await fetch(`${BASE_URL}/dogs`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ids),
  });
  return res.json();
}

export async function fetchMatch(ids: string[]) {
  const res = await fetch(`${BASE_URL}/dogs/match`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ids),
  });
  return res.json();
}