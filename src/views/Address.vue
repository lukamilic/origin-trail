<template>
  <div class="container">
   <div class="row mb-4">
      <div class="col-sm-12 mb-4">
         <h4>Address: <span class="fw-bold">{{ address }}</span></h4>
      </div>
      <div class="col-sm-12">
          <h4>Contract</h4>
          <div class="d-flex justify-content-center">
            <p class="fw-bold px-2">Balance:</p>
            <p class="">{{ balance }} ETH</p>
          </div>
          <div class="d-flex justify-content-center">
            <p class="fw-bold px-2">Value:</p>
            <p class="">${{ ethToUsd(balance) }} (@ $1,844.69/ETH)</p>
          </div>
      </div>
   </div>
   <div class="row mt-4">
    <div class="col-sm-12">
         <h4>Normal Transactions:</h4>
      </div>
      <div class="table-responsive">
        <table class="table table-hover w-auto">
          <thead>
              <tr>
                <th>TX Hash</th>
                <th>Block</th>
                <th>Time</th>
                <th>From</th>
                <th>To</th>
                <th>Value</th>
                <th>Total Value</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="normalTransaction in computedNormalTransactions" :key="normalTransaction.contractAddress">
                <td class="text-truncate">{{ normalTransaction.hash }}</td>
                <td class="w-25 text-truncate">{{ normalTransaction.blockNumber }}</td>
                <td class="w-25 text-truncate">{{ formatTime(normalTransaction.timeStamp) }}</td>
                <td class="w-25 text-truncate">{{ normalTransaction.from }}</td>
                <td class="w-25 text-truncate">{{ normalTransaction.to }}</td>
                <td class="w-25 text-truncate">{{ normalTransaction.value / 1000000000000000000 }} ETC</td>
                <td class="w-25 text-truncate">{{ normalTransaction.totalValue }} ETC</td>
              </tr>
          </tbody>
        </table>
      </div>
   </div>
   <div v-if="computedInternalTransactions.length" class="row mt-4">
    <div class="col-sm-12">
         <h4>Internal Transactions:</h4>
      </div>
      <table class="table table-hover w-auto">
         <thead>
            <tr>
               <th>TX Hash</th>
               <th>Block</th>
               <th>Time</th>
               <th>From</th>
               <th>To</th>
               <th>Value</th>
            </tr>
         </thead>
         <tbody>
            <tr v-for="internalTransaction in computedInternalTransactions" :key="internalTransaction.contractAddress">
               <td class="text-truncate">{{ internalTransaction.hash }}</td>
               <td class="w-25 text-truncate">{{ internalTransaction.blockNumber }}</td>
               <td class="w-25 text-truncate">{{ formatTime(internalTransaction.timeStamp) }}</td>
               <td class="w-25 text-truncate">{{ internalTransaction.from }}</td>
               <td class="w-25 text-truncate">{{ internalTransaction.to }}</td>
               <td class="w-25 text-truncate">{{ internalTransaction.value / 1000000000000000000 }} ETC</td>
            </tr>
         </tbody>
      </table>
   </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  props: {
    address: String,
    startblock: String,
    endblock: String,
  },
  data () {
    return {
      balance: null,
      ethPriceUsd: 0,
      normalTransactions: [],
      internalTransactions: [],
    }
  },
  computed: {
    computedNormalTransactions() {
      return this.normalTransactions.map((transaction) => {
        const { hash, blockNumber, timeStamp, from, to, value, gasUsed, gasPrice } = transaction;
        const totalValue = (gasPrice / 10**18) * gasUsed;

        return {
          hash,
          blockNumber,
          timeStamp,
          from,
          to,
          value,
          totalValue
        }
      })
    },
    computedInternalTransactions() {
      return this.internalTransactions.map((transaction) => {
        const { hash, blockNumber, timeStamp, from, to, value, gasUsed, gasPrice } = transaction;
        const totalValue = (gasPrice / 10**18) * gasUsed;

        return {
          hash,
          blockNumber,
          timeStamp,
          from,
          to,
          value,
          totalValue
        }
      })
    }
  },
  methods: {
    formatTime(date) {
      return new Date(date * 1000).toISOString().slice(0, 19).replace('T', ' ');
    },
    ethToUsd(eth) {
      let ethToUsd = eth * this.ethPriceUsd;
      return ethToUsd.toFixed(2);
    },
    async getBalance() {
      let response = await axios.get(
          "https://api.etherscan.io/api" +
          "?module=account&action=balance&address=" +
            this.address +
            "&tag=latest&apikey=" +
            process.env.VUE_APP_API_KEY
        )
        this.balance = response.data.result / 1000000000000000000
    },
    async getEthPrice() {
      let response = await axios.get(
          "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=" +
            process.env.VUE_APP_API_KEY
        )
        this.ethPriceUsd = response.data.result.ethusd
    },
    async getNormalTransactions(page) {
      let response = await axios.get(
          "https://api.etherscan.io/api?module=account&action=txlist&address=" +
            this.address +
            "&startblock=" +
            this.startblock +
            "&endblock=" +
            this.endblock +
            "&page=" +
            page +
            "&offset=10&sort=asc&apikey=" +
            process.env.VUE_APP_API_KEY
        )
        this.normalTransactions = response.data.result
        console.log(this.normalTransactions);
    },
    async getInternalTransactions(page) {
      let response = await axios.get(
          "https://api.etherscan.io/api?module=account&action=txlistinternal&address=" +
            this.address +
            "&startblock=" +
            this.startblock +
            "&endblock=" +
            this.endblock +
            "&page=" +
            page +
            "&offset=10&sort=asc&apikey=" +
            process.env.VUE_APP_API_KEY
        )
        
        this.internalTransactions = response.data.result;
    },
  },
  mounted() {
    this.getBalance();
    this.getEthPrice();
    this.getNormalTransactions(1);
    this.getInternalTransactions(1);
  },
}
</script>