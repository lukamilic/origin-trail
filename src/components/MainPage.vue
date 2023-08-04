<template> 
 <div class="container">
    <div class="row">
      <div class="col-md-12 mb-5">
        <h2>Ethereum Transactions Explorer</h2>
        <form class="mb-3" @submit.prevent>
          <div class="search-panel-container bg-white border rounded d-flex gap-2 p-1.5">
            <div class="d-flex gap-4 flex-grow-1 position-relative auto-search-max-height">
              <input 
                v-model="address" 
                required 
                type="text" 
                class="flex-grow-1 fs-base border-0 pe-8" 
                placeholder="Search by Address"
              >
              <input 
                v-model="startBlock" 
                type="text" 
                class="border border-1 rounded" 
                placeholder="Start Block"
              >
              <input 
                v-model="endBlock" 
                type="text" 
                class="border border-1 rounded" 
                placeholder="End Block"
              >
            </div>
            <div>
              <button class="btn fs-base btn-primary" type="submit" @click="viewAddress">
                  <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12 mb-5">
        <h2>Ethereum Balance</h2>
        <form class="mb-3" @submit.prevent>
          <div class="search-panel-container bg-white border rounded d-flex gap-2 p-1.5">
            <div class="d-flex gap-4 flex-grow-1 position-relative auto-search-max-height">
              <input 
                v-model="timeAddress" 
                required 
                type="text" 
                class="flex-grow-1 fs-base border-0 pe-8" 
                placeholder="Search by Address"
              >
              <input v-model="timeValue" type="datetime-local">
            </div>
            <div>
              <button class="btn fs-base btn-primary" type="submit" @click="viewBalance">
                  <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>
        </form>
       
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 text-center">
        <h3>1 ETH =</h3>
      </div>
      <div class="col-sm-12 col-md-3">
        <div class="card">
          <img class="card-img-top mx-auto" style="width: 50px; height: 50px;" src="../../public/img/btc.png" alt="Card image cap">
          <div class="card-body">
            <p class="card-text">BTC</p>
            <p class="card-text">{{ ethPrice.BTC }}</p>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-3">
        <div class="card">
          <img class="card-img-top mx-auto" style="width: 50px; height: 50px;" src="../../public/img/eu.png" alt="Card image cap">
          <div class="card-body">
            <p class="card-text">EUR</p>
            <p class="card-text">{{ ethPrice.EUR }}</p>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-3">
        <div class="card">
          <img class="card-img-top mx-auto" style="width: 50px; height: 50px;" src="../../public/img/usa.png" alt="Card image cap">
          <div class="card-body">
            <p class="card-text">USD</p>
            <p class="card-text">{{ ethPrice.USD }}</p>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-3">
        <div class="card">
          <img class="card-img-top mx-auto" style="width: 50px; height: 50px;" src="../../public/img/canada.png" alt="Card image cap">
          <div class="card-body">
            <p class="card-text">CAD</p>
            <p class="card-text">{{ ethPrice.CAD }}</p>
          </div>
        </div>
      </div>
    </div>
 </div>
 {{ Math.floor(Date.now()/1000) }}
</template>

<script>
import axios from 'axios';
export default {
  name: 'MainPage',
  data () {
    return {
      address: '',
      startBlock: '',
      endBlock: '',
      timeAddress: '',
      timeValue: '',
      ethPrice: [],
      ethBlockNumber: '',
    }
  },
  methods: {
    viewAddress() {
      this.address = this.address.trim();
      if (!this.startBlock) {
        this.startBlock = 0;
      } 
      if (!this.endBlock) {
        this.endBlock = this.ethBlockNumber.toString();
      }
      this.$router.push({
          name: "Address",
          params: {
            address: this.address,
            startblock: this.startBlock,
            endblock: this.endBlock,
          },
        });
    },
    async viewBalance() {
      let timestamp = this.timeValue ? 
          Math.floor(new Date(this.timeValue).getTime()/1000.0) : Math.floor(Date.now()/1000);
      if (!this.endBlock) {
        this.endBlock = this.ethBlockNumber.toString();
      }
      try {
        const response = await axios.get(
            "https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=" +
              timestamp +
              "&closest=before&apikey=" +
              process.env.VUE_APP_API_KEY
          );
          this.startBlock = response.data.result;
      } catch (error) {
          console.log(error.message);
      }
      
      this.$router.push({
          name: "BalanceCheck",
          params: {
            address: this.timeAddress,
            startblock: this.startBlock,
            endblock: this.endBlock,
          },
        });
    },  
    getEthPrice() {
      axios
        .get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,CAD,EUR,BTC")
        .then((response) => (this.ethPrice = response.data));
    },
    getEthBlockNumber() {
      axios
        .get("https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=" +
          process.env.VUE_APP_API_KEY
        ).then((response) => ((this.ethBlockNumber = parseInt(response.data.result))));
        
    },
  },
  mounted() {
    this.getEthPrice();
    this.getEthBlockNumber();
  },
}
</script>

<style scoped>

</style>
