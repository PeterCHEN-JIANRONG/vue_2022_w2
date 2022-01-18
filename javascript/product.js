import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.27/vue.esm-browser.min.js';


const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'peter_vue2022',
      products: [],
      tempProduct: {},
    }
  },
  methods: {
    loginCheck() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getProducts();
        }).catch((err) => {
          alert(err.data.message);
          window.location = 'index.html';
        });
    },
    getProducts() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
      axios.get(url)
        .then((res) => {
          this.products = res.data.products;
        }).catch((err) => {
          console.log(err.data.message);
        })
    },
    openProduct(item) {
      this.tempProduct = { ...item };
    },
  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    //  axios 預設token設定，參考：https://github.com/axios/axios#custom-instance-defaults
    axios.defaults.headers.common.Authorization = token;

    // 登入驗證
    this.loginCheck();
  },
});

app.mount('#app');