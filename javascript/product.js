import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.27/vue.esm-browser.min.js';
import pagination from './components/Pagination.js';

// modal元件
let productModal = null;
let delProductModal = null;
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'peter_vue2022';

const app = createApp({
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {
        imagesUrl: [],
      },
      isNew: true,
    }
  },
  components: {
    pagination
  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    //  axios 預設token設定，參考：https://github.com/axios/axios#custom-instance-defaults
    axios.defaults.headers.common.Authorization = token;

    // 登入驗證
    this.loginCheck();
  },
  methods: {
    loginCheck() {
      const url = `${apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getProducts();
        }).catch((err) => {
          alert(err.data.message);
          window.location = 'login.html';
        });
    },
    getProducts(page = 1) {
      const url = `${apiUrl}/api/${apiPath}/admin/products?page=${page}`;
      axios.get(url)
        .then((res) => {
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        }).catch((err) => {
          alert(err.data.message);
        })
    },
    openModal(state, item) {
      if (state === 'create') {
        this.isNew = true;
        this.tempProduct = {
          imagesUrl: [],
        };
        productModal.show();
      } else if (state === 'update') {
        this.isNew = false;
        this.tempProduct = { ...item };
        productModal.show();
      } else if (state === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },
  },
});

app.component('productModal', {
  template: '#productModalTemplate',
  props: ['tempProduct', 'isNew'],
  data() {
    return {
      status: {
        fileUploading: false,
      },
    }
  },
  methods: {
    updateProduct() {
      // create 新增
      let url = `${apiUrl}/api/${apiPath}/admin/product`;
      let httpMethod = 'post';

      // update 修改
      if (!this.isNew) {
        url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
        httpMethod = 'put';
      }

      axios[httpMethod](url, { data: this.tempProduct })
        .then((res) => {
          // alert(res.data.message);
          productModal.hide();
          this.$emit('get-products');
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
    upLoadImage() {
      this.status.fileUploading = true;
      const url = `${apiUrl}/api/${apiPath}/admin/upload`;
      const formData = new FormData();
      formData.append('file-to-upload', this.$refs.fileInput.files[0]);

      axios.post(url, formData)
        .then(res => {
          this.tempProduct.imageUrl = res.data.imageUrl;
          this.$refs.fileInput.value = "";
          this.status.fileUploading = false;
        })
        .catch(err => {
          alert(err.data.message);
        })
    },
    setImagesUrlToArray() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    }
  },
  mounted() {
    // 創建modal元件
    productModal = new bootstrap.Modal(this.$refs.productModal, {
      // backdrop: 'static',
      // keyboard: false
    });
  },
});

app.component('delProductModal', {
  template: '#delProductModalTemplate',
  props: ['tempProduct'],
  methods: {
    deleteProduct() {
      // delete 刪除
      const url = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.$emit('get-products');
        }).catch((err) => {
          alert(arr.data.message);
        })
    },
  },
  mounted() {
    // 創建modal元件
    delProductModal = new bootstrap.Modal(this.$refs.delProductModal, {
      // backdrop: 'static',
      // keyboard: false
    });
  },
});


app.mount('#app');