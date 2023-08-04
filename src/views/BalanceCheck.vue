<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-12 mb-4">
        <h4>Contract: <span class="fw-bold">{{ address }}</span></h4>
      </div>
  </div>
  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Balance</th>
          <th>Token Quantity at Time</th>
          <th>Difference</th>
          <th>ETH Price {{ targetBalance }}  </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ balance }} ETH</td>
          <td>{{ targetBalance }} ETH</td>
          <td>{{ balance - targetBalance }} ETH</td>
          <td>{{ (ethPrice.ethbtc * this.targetBalance).toFixed(2) }} ₿</td>
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
      page: 1,
      balance: 0,
      ethPrice: 0,
      targetBalance: 0,
      normalTransactions: [],
    }
  },
  methods: {
    ethToUsd(eth) {
      let ethToUsd = eth * this.ethPrice;
      return ethToUsd.toFixed(2);
    },
    async calculateEthOnAdress() {
      try {
        const response = await axios.get(
          "https://api.etherscan.io/api?action=balance&address=" +
            this.address +
            "&tag=latest&module=account&apikey=" +
            process.env.VUE_APP_API_KEY
        );
        this.balance = response.data.result / 1000000000000000000;
      } catch (e) {
        console.log(e.message)
      }
      this.targetBalance = this.balance;
      let status = true;
      let page = 1;
      for (page; status; page++) {
        try {
          const response = await axios.get(
            "https://api.etherscan.io/api?module=account&action=txlist&address=" +
              this.address +
              "&startblock=" +
              this.startblock +
              "&endblock=" +
              this.endblock +
              "&page=" +
              page +
              "&offset=100&sort=asc&apikey=" +
              process.env.VUE_APP_API_KEY
          );
          if (response.data.status == "1") {
            this.normalTransactions = response.data.result;

            this.normalTransactions.forEach((transaction) => {
              if (transaction.from == this.address) {
                this.targetBalance +=
                  transaction.value / 1000000000000000000 +
                  (transaction.gasPrice / 1000000000000000000) * transaction.gasUsed;
              } else if (transaction.to == this.address) {
                this.targetBalance -=
                  transaction.value / 1000000000000000000 +
                  (transaction.gasPrice / 1000000000000000000) * transaction.gasUsed;
              }
            });
          } else {
            status = false;
          }
        } catch (e) {
          console.log(e.message);
        }
      }
    },
    async getEthPrice() {
      let response = await axios
        .get(
          "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=" +
            process.env.VUE_APP_API_KEY
        )
        this.ethPrice = response.data.result;
    },
  },
  mounted() {
    this.calculateEthOnAdress();
    this.getEthPrice();
  }
}
</script>