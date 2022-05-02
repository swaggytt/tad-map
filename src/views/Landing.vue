<template>
  <div class="landing">
    <div class="nav-incident">
      <div style="color: white">KMITL's Traffic Anomaly Detection</div>
      <hr style="margin: 15px 0" />
      <div style="color: white; width: 100%">Road Number</div>
      <select
        v-model="roadNo"
        name="roadNumber"
        class="input-select"
        style="width: 100%; margin: 10px 0"
      >
        <option value="">Show all</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="7">7</option>
      </select>
      <div style="color: white; width: 100%">Road Direction</div>
      <select
        v-model="roadDirection"
        name="roadDirection"
        class="input-select"
        style="width: 100%; margin: 10px 0"
      >
        <option value="">Show all</option>
        <option value="in">in</option>
        <option value="out">out</option>
      </select>
      <div style="color: white">Result</div>
      <div class="incident-result">
        <div class="incident-result-item">
          <div
            v-for="(item, index) in incidentVal"
            :key="index"
            class="traffic-event-item"
          >
            <div class="event-item">{{ item.title }}</div>
            <div class="jump-btn" @click="clickEvent(item, index)">Go</div>
          </div>
        </div>
        <div class="middle-section" @click="loadMore">กดเพื่อโหลดเพิ่ม</div>
        <div class="bottom-section">
          <hr class="line" />
          <div class="total">
            <span>Total :</span>
            <span>{{ markersList.length }}</span>
          </div>
        </div>
      </div>
      <div class="menu-tap">
        <div
          class="menu-tap-left"
          :class="tap === 'history' ? 'active' : ''"
          @click="tap = 'history'"
        >
          Accident History
        </div>
        <div
          class="menu-tap-right"
          :class="tap === 'real-time' ? 'active' : ''"
          @click="tap = 'real-time'"
        >
          Real-time Detection
        </div>
      </div>
    </div>
    <longdo-map v-if="tap === 'real-time'" class="longdo-map" @load="onLoad">
      <longdo-map-marker
        v-for="(item, i) in incidentVal"
        :key="i"
        :location="item.location"
        :title="item.title"
        :detail="item.detail"
        :icon="icon"
        @add="addMarker"
      />
    </longdo-map>
    <div class="twitter-feed" style="width: 100%" v-else-if="tap === 'history'">
      <twitter>
        <a
          class="twitter-timeline"
          href="https://twitter.com/js100radio?ref_src=twsrc%5Etfw"
          >Tweets by js100radio</a
        >
      </twitter>
    </div>
  </div>
</template>
<script>
import { LongdoMapMarker } from "longdo-map-vue";
import axios from "axios";
import dayjs from "dayjs";
var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
export default {
  name: "App",
  components: { LongdoMapMarker },
  data() {
    return {
      location: {
        lat: 13.714048,
        lon: 100.4808,
      },
      markers: [
        {
          location: { lon: 100.58, lat: 13.761 },
          title: "Vue Marker",
          detail: "Detail section",
        },
        {
          location: { lon: 100.59, lat: 13.761 },
          title: "Vue Marker",
          detail: "Detail section",
        },
        {
          location: { lon: 100.59, lat: 13.761 },
          title: "Vue Marker",
          detail: "Detail section",
        },
      ],
      icon: {
        url: require("@/assets/icons/warning.png"),
        size: {
          width: 32,
          height: 32,
        },
        offset: {
          x: 32,
          y: 32,
        },
      },
      map: {},
      markersfn: [],
      markersList: [],
      tap: "real-time",
      anomalyAmount: 20,
      roadNo: "",
      roadDirection: "",
    };
  },
  computed: {
    incidentVal() {
      let dataArr = this.markersList;
      if (this.roadNo) {
        dataArr = dataArr.filter((item) => {
          return item.roadNo === parseInt(this.roadNo);
        });
      }
      if (this.roadDirection) {
        dataArr = dataArr.filter((item) => {
          return item.roadDirection === this.roadDirection;
        });
      }
      return dataArr;
    },
  },
  mounted() {
    this.fetchIncident();
  },
  methods: {
    async fetchIncident() {
      const res = await axios.get(
        `${process.env.VUE_APP_BACKEND}/bydate/${this.anomalyAmount}`
      );
      const incidentList = res.data.map((item) => {
        return {
          roadNo: item.road_no,
          roadDirection: item.direction,
          location: {
            lon: item.lon,
            lat: item.lat,
          },
          title: `ความผิดปกติถนนหมายเลข ${item.road_no} กม. ${item.km} ${
            item.direction === "in" ? "ขาเข้า" : "ขาออก"
          } `,
          detail: `เกิดความผิดปกติของการจราจรบนถนนหมายเลข ${
            item.road_no
          } หลักกิโลเมตรที่ ${item.km} ${
            item.direction === "in" ? "ขาเข้า" : "ขาออก"
          } ความเร็วรถเฉลี่ย ${item.avg_speed} km/hr <br>${dayjs(
            dayjs(item.date_time).format()
          )
            .utc()
            .format("DD/MM/YYYY h:mm A")}`,
          dateTime: dayjs(dayjs(item.date_time).format())
            .utc()
            .format("DD/MM/YYYY h:mm A"),
        };
      });
      this.markersList = incidentList;
      // console.log(this.markersList);
    },
    onLoad(map) {
      map.location(this.markers[0].location);
      this.map = map;
      // console.log(this.map);
      // map.zoom(18);
    },
    addMarker(marker) {
      this.markersfn.push(marker);
    },
    clickMarker() {
      // console.log("event");
    },
    clickEvent(item, index) {
      this.map.location(item.location);
      this.map.zoom(13);
      setTimeout(() => {
        this.markersfn[index].pop();
      }, 500);
      // console.log(this.markersfn);
    },
    loadMore() {
      this.anomalyAmount += 10;
      this.fetchIncident();
    },
  },
};
</script>

<style lang="scss" scoped>
.landing {
  /* height: 100vh; */
  display: flex;
}
.nav-incident {
  width: 30vw;
  padding: 10px;
  background-color: #242e8c;
}
.twitter-feed {
  height: 100%;
  overflow: auto;
}
.event-item {
  color: white;
}
.traffic-event-item {
  padding: 10px 0;
  border-bottom: 1px solid #868ef2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.incident-result {
  padding: 0 10px;
  margin-top: 10px;
  height: 70%;
  background: #414bb1;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  overflow: auto;
}
.jump-btn {
  background-color: #828ef2;
  color: white;
  padding: 5px;
  border-radius: 13px;
  cursor: pointer;
}
.line {
  background-color: #868ef2;
  color: #868ef2;
  border-color: #868ef2;
  width: 100%;
}
.middle-section {
  display: flex;
  color: white;
  margin-top: 10px;
  justify-content: center;
  background: #868ef2;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  cursor: pointer;
}
.bottom-section {
  margin-bottom: 20px;
  color: white;
}
.total {
  display: flex;
  justify-content: space-between;
}
.menu-tap {
  display: flex;
  width: 100%;
  color: white;
  margin-top: 20px;
  .menu-tap-left,
  .menu-tap-right {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #414bb1;
    width: 100%;
    height: 50px;
    &.active {
      background-color: #868ef2;
    }
    cursor: pointer;
  }
  .menu-tap-left {
    border-radius: 13px 0 0 13px;
  }
  .menu-tap-right {
    border-radius: 0 13px 13px 0;
  }
}
</style>
