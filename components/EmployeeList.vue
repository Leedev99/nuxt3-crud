<template>
  <div class="pt-15">
    <v-container>
      <v-row class="mb-6">
        <v-col cols="12" md="6">
          <h2 class="mb-2">ລາຍການພະນັກງານ</h2>
          <v-text-field
            v-model="searchModel"
            density="compact"
            variant="outlined"
            label="ຄົ້ນຫາພະນັກງານ"
            append-inner-icon="mdi-magnify"
            hide-details
            clearable
            @click:clear="onClearSearch"
            @click:append-inner="onClickSearch"
          ></v-text-field>
        </v-col>
        <v-col md="6" offset-md="0" class="text-end align-self-end">
          <v-btn color="success" class="align-self-end" @click="onClickAdd">
            <v-icon> mdi-plus</v-icon> ເພິ່ມພະນັກງານ</v-btn
          >
        </v-col>
      </v-row>
      <v-divider class="pt-3" />

      <v-table density="compact">
        <thead>
          <tr>
            <th class="text-left">ລະຫັດ</th>
            <th class="text-left">ຊື່ພະນັກງານ</th>
            <th class="text-left">ຕຳແໜ່ງ</th>
            <th class="text-left">ທີ່ຢູ່</th>
            <th class="text-left">ເບິໂທ</th>
            <th class="text-left">ວັນທິ່ສ້າງ</th>
            <th class="text-left">ເຄື່ອງມື</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filterData.length > 0 ? filterData : empData"
            :key="item.id"
          >
            <td>{{ item.id }}</td>
            <td>{{ item.empname }}</td>
            <td>{{ item.emprole }}</td>
            <td>{{ item.empaddress }}</td>
            <td>{{ item.emptel }}</td>
            <td>{{ moment(item.createdAt).format("DD/MM/YYYY") }}</td>
            <td>
              <v-icon class="btnAction" @click="onClickUpdate(item)"
                >mdi-lead-pencil</v-icon
              >
              <v-icon class="btnAction" color="red" @click="onClickDelete(item)"
                >mdi-trash-can</v-icon
              >
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-container>

    <v-dialog v-model="dialog" width="500">
      <v-form>
        <v-card class="rounded-lg">
          <v-card-title class="text-h5 pt-7 ml-2">
            <p>{{ dialogDetail.title }}</p>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.empname"
                  class="pt-2"
                  label="ຊື່ພະນັກງານ"
                  variant="outlined"
                  required
                  :rules="[(v) => !!v || 'ກະລຸນາປ້ອນຊື່ພະນັກງານ']"
                ></v-text-field>
                <v-text-field
                  v-model="form.emprole"
                  class="pt-2"
                  label="ຕຳແໜ່ງ"
                  variant="outlined"
                  required
                  :rules="[(v) => !!v || 'ກະລຸນາປ້ອນຕຳແໜງພະນັກງານ']"
                ></v-text-field>
                <v-text-field
                  v-model="form.emptel"
                  class="pt-2"
                  label="ເບີໂທລະສັບ"
                  variant="outlined"
                  type="number"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  :rules="[(v) => !!v || 'ກະລຸນາໃສ່ເບີໂທ']"
                ></v-text-field>
                <v-textarea
                  v-model="form.empaddress"
                  class="pt-2"
                  label="ທີ່ຢູ່"
                  rows="2"
                  variant="outlined"
                  required
                  :rules="[(v) => !!v || 'ກະລຸນາປ້ອນທີ່ຢູ່ພະນັກງານ']"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-0 ma-0">
            <v-col cols="6">
              <v-btn
                class="text-capitalize"
                color="red w-100"
                x-large
                @click="(dialog = false), clearForm"
              >
                ຍົກເລີກ
              </v-btn>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="6" class="ma-0 pa-0">
              <v-btn
                class="text-capitalize"
                depressed
                color="green-darken-4 w-100"
                x-large
                @click="handleClickSave"
              >
                ບັນທືກ
              </v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script setup>
import moment from "moment";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import axios from "axios";
const dialog = ref(false);
const empData = ref([]);
const searchModel = ref("");
const expanded = ref([]);
const filterData = ref([]);
const dialogDetail = ref({
  title: "",
  isUpdate: false,
  id: "",
});
const form = reactive({
  empname: "",
  empaddress: "",
  emprole: "",
  emptel: "",
});

const basURL = ref(
  "https://64c625efc853c26efadb22f5.mockapi.io/api/v1/employees"
);
onMounted(() => {
  getEmployee();
});

const clearForm = () => {
  dialogDetail._rawValue.isUpdate = false;
  dialogDetail._rawValue.id = "";
  form.empname = "";
  form.empaddress = "";
  form.emprole = "";
  form.emptel = "";
};

const onClickSearch = () => {
  const data = empData._rawValue;
  const filterItems = (needle, heystack) => {
    let query = needle.toLowerCase();
    return heystack.filter(
      (item) => item.empname.toLowerCase().indexOf(query) >= 0
    );
  };
  filterData.value = filterItems(searchModel._rawValue, data);
  console.log(empData._rawValue);
};
const onClearSearch = () => {
  console.log("ghfhgjh");
  filterData.value = [];
};
const onClickAdd = () => {
  clearForm();
  console.log("click add");
  dialogDetail._rawValue.title = "ເພີ່ມພະນັກງານໃຫມ່";
  dialog.value = true;
};
const handleClickSave = async () => {
  if (
    (!form.empname == "" && !form.empaddress == "" && !form.emprole == "",
    !form.emptel == "")
  ) {
    try {
      if (dialogDetail._rawValue.isUpdate) {
        //update

        const resp = await axios.put(
          `${basURL.value}/${dialogDetail._rawValue.id}`,
          form
        );
        if (resp.status == 200) {
          dialog.value = false;
          Swal.fire("Good job!", "ອັບຂໍ້ມູນສຳແລັດ", "success");
          getEmployee();
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="">Why do I have this issue?</a>',
          });
        }
      } else {
        //Insert data
        const resp = await axios.post(`${basURL.value}`, form);
        if (resp.status == 201) {
          dialog.value = false;
          Swal.fire("Good job!", "ເພີ່ມພະນັກງານສຳແລັດ", "success");
          getEmployee();
        } else {
          dialog.value = false;
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="">Why do I have this issue?</a>',
          });
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="">Why do I have this issue?</a>',
      });
    }
  }
};
const onClickDelete = (item) => {
  console.log("you click delete btn", item);
  Swal.fire({
    title: "Are you sure?",
    text: `ເຈົ້າຕ້ອງການລົບຂໍມູນພະນັກງານຊື່ ${item.empname} ອອກຈາກລະບົບແທ້ບໍ ?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "ຕົກລົງ,ຂ້ອຍຈະລົບແທ້!",
    cancelButtonText: "ຍົກເລິກ",
  }).then((result) => {
    if (result.isConfirmed) {
      confirmDelete(item.id);
    }
  });
};
const confirmDelete = async (id) => {
  try {
    const resp = await axios.delete(`${basURL.value}/${id}`);
    if (resp.status == 200) {
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
      getEmployee();
    }
  } catch (error) {}
};
const onClickUpdate = (item) => {
  console.log("you click update btn");
  dialogDetail._rawValue.title = "ແກ້ໄຂ້ຂໍມູນພະນັກງານ";
  dialogDetail._rawValue.isUpdate = true;
  dialogDetail._rawValue.id = item.id;
  form.empname = item.empname;
  form.empaddress = item.empaddress;
  form.emprole = item.emprole;
  form.emptel = item.emptel;
  dialog.value = true;
};
const getEmployee = async () => {
  try {
    const respone = await axios.get(`${basURL.value}`);
    // console.log(respone);
    if (respone.status == 200) {
      empData.value = respone.data;
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss" scoped>
.btnAction {
  cursor: pointer;
}
</style>
