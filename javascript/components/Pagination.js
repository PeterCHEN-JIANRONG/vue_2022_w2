export default {
  props: ['pagination'],
  template: `<nav aria-label="Page navigation example">
  <ul class="pagination justify-content-center">
    <li class="page-item" :class="{ disabled : !pagination.has_pre }">
      <a class="page-link" href="#" aria-label="Previous"
      @click="$emit('get-products', pagination.current_page - 1)">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
    <li class="page-item" v-for="page in pagination.total_pages" :key="'page'+page"
    :class="{ active : page === pagination.current_page }">
      <a class="page-link" href="#" @click="$emit('get-products', page)">{{page}}</a></li>
    <li class="page-item" :class="{ disabled : !pagination.has_next }">
      <a class="page-link" href="#" aria-label="Next"
      @click="$emit('get-products', pagination.current_page + 1)">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  </ul>
</nav>`
}