import apiClient from './apiClient'

export async function fetchGems(
  filters = {}
) {
  try {
    const params =
      new URLSearchParams()

    if (filters.type) {
      params.append(
        'type',
        filters.type
      )
    }

    if (filters.clarity) {
      params.append(
        'clarity',
        filters.clarity
      )
    }

    if (filters.sort) {
      params.append(
        'sort',
        filters.sort
      )
    }

    if (filters.status) {
      params.append(
        'status',
        filters.status
      )
    }

    const query =
      params.toString()

    const response =
      await apiClient.get(
        `/gems${
          query
            ? `?${query}`
            : ''
        }`
      )

    let gems =
      response.data

    if (
      filters.minPrice !=
      null
    ) {
      gems = gems.filter(
        gem =>
          Number(
            gem.price
          ) >=
          Number(
            filters.minPrice
          )
      )
    }

    if (
      filters.maxPrice !=
      null
    ) {
      gems = gems.filter(
        gem =>
          Number(
            gem.price
          ) <=
          Number(
            filters.maxPrice
          )
      )
    }

    return gems

  } catch (error) {
    console.error(
      'Error fetching gems:',
      error
    )

    return []
  }
}


export async function fetchGemById(
  id
) {
  try {
    const response =
      await apiClient.get(
        `/gems/${id}`
      )

    return response.data

  } catch (error) {
    console.error(
      `Error fetching gem ${id}:`,
      error
    )

    return null
  }
}