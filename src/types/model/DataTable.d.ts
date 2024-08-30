declare namespace Model {
  module DataTable{
    interface ResponseDt<T> {
      data : T,
      current_page:number,
      per_page:number,
      total_items:number,
      total_pages:number,
      next_page:number | null,
      prev_page:number | null,
    }

  }
}