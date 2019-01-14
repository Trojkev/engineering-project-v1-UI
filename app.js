let SideNav = Vue.component('side-nav', {
  template: `
  <section>
    <div class="container-fluid" id="side-bar-component">
      <div class="card" style="height: 90vh">
        <div class="card-header">
          <h5 class="card-title text-center">{{title}}</h5>
        </div>
        <div class="card-body">
          <div class="card-block">
            <div class="row" v-for="item in linkItems">
              <div style="padding: 5%">
                <router-link :to="item.path"><h5>{{item.name}}</h5></router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `,
  data() {
    return {
      title: 'Navigation',
      linkItems: [
        { name: 'Risk Types', path: '/' },
        { name: 'Customers', path: '/customers'}
      ],
    }
  },
});

let RiskTypes = Vue.component('risk-types', {
  template: `
  <div class="container-fluid" id="risk-types">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-md-10">
              <h4 class="card-title">Risk Types</h4>
            </div>
            <div class="col-md-2">
              <router-link to="/add-risk-type"><button type="button"
              name="btnAdd" class="btn btn-primary">Add Risk Type</button>
              </router-link>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="card-block">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th v-for="header in headers">{{ header }} </th>
                </tr>
              </thead>
              <tbody v-if="dataAvailable">
                <tr v-for="(type, index) in risky">
                  <td>{{ index + 1 }}</td>
                  <td>{{ type.name }}</td>
                  <td>{{ type.description }}</td>
                  <td>{{ type.state__name }}</td>
                  <td>{{ type.date_created | date }}</td>
                  <td v-if="!type.has_form">
                    <router-link :to="{path: '/add-fields/' + type.id}" title="Add form">
                      <button class="btn btn-outline-info">Add</button>
                    </router-link>
                  </td>
                  <td v-else>
                    <router-link :to="{path: '/risk-type-form/' + type.id}" title="View form">
                      <button class="btn btn-outline-info">View</button>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
            <center><bar-loader class="custom-class" :loading="loading"
              style="size: 150px color: #bada55"></bar-loader></center>
            <div class="center" v-if="!dataAvailable">
              <center >No data available</center>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      dataAvailable: false,
      loading: false,
      headers: ['#', 'Name', 'Description', 'Status', 'Date Created', 'Actions'],
      r_types: null,
    }
  },
  mounted() {
    this.loading = true;
    axios.get('http://127.0.0.1:8000/api/risk_types/').then(resp => {
      this.risky = resp.data.data;
      this.dataAvailable = true;
      this.loading = false;
    }).catch(error => {
      this.loading = false;
      console.log(error);
    });
  }
});

let AddRiskType = Vue.component('add-risk-type', {
  template: `
  <section>
    <div class="container-fluid" id="add-risk-type">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-md-10">
              <h5 class="card-title">New Risk Type</h5>
            </div>
            <div class="col-md-2">
            <router-link to="/"><button type="button" name="back" class="btn
            btn-secondary">Back To All</button>
            </router-link>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="card-block">
          <form>
            <div class="form-group col-md-6">
              <label for="name">Name</label>
              <input type="text" class="form-control" id="name"
               placeholder="Enter name" v-model="r_type.name" required>
            </div>
            <div class="form-group col-md-6">
              <label for="description">Description</label>
              <textarea class="form-control" id="description" v-model="r_type.description"
              placeholder="Enter description here"></textarea>
            </div>
            <router-link to="/"><button type="submit" class="btn btn-primary"
             @click.prevent="onSubmit">Submit</button></router-link>
          </form>
          </div>
        </div>
      </div>
    </div>
  </section>
  `,
  data() {
    return {
      r_type: {
        name: '',
        description: ''
      }
    }
  },
  methods: {
    onSubmit() {
      axios.post('http://127.0.0.1:8000/api/add_risk_type/', this.r_type).then(resp => {
        if (resp.data.status == 'success'){
          this.$swal('Success', 'Risk Type created successfully!', 'success');
        } else {
          this.$swal('Oops..', 'Something went wrong while creating RiskType!', 'error');
        }
      }).catch(error => {
        console.log(error);
      });
    }
  },
});

let ConfigRiskType = Vue.component('add-field', {
  template: `
  <section>
	<div class="card">
		<div class="card-header">
			<button class="btn btn-primary" @click="addNewField">New Field</button>
		</div>
		<div class="card-body">
			<div class="card-block">
				<form>
					<div class="card" v-for="(field, index) in fields">
            <div class="card-header">
              Enter Field Details
              <span class="float-right" style="cursor:pointer" @click="removeField(index)">X</span>
            </div>
						<div class="card-body">
							<div class="row">
							  <div class="form-group col-md-4">
									<label for="caption">Caption</label>
									<input type="text" class="form-control" placeholder="Enter caption"
                   id="caption" required v-model="field.caption">
							  </div>
							  <div class="form-group col-md-4">
									<label for="fieldType">Field Type</label>
									<select id="fieldType" class="form-control" required v-model="field.field_type">
                    <option value="" disabled> -- Select Type -- </option>
									  <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="file">File Upload</option>
									</select>
							  </div>
                <div class="form-group col-md-4">
									<label for="default">Default Value</label>
									<input type="text" class="form-control" placeholder="Enter default"
                    id="default" v-model="field.default_value">
							  </div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
    <div class="card-footer">
      <router-link to="/"><button class="btn btn-primary" @click="submitFields">
       Submit </button></router-link>
    </div>
	</div>
</section>
  `,
  data() {
    return {
      id: this.$route.params.id,
      fields: [{
        caption: '',
        field_type: '',
        default_value: ''
      }],
      risk_fields: null
    }
  },
  methods: {
    addNewField() {
      this.fields.push({
        caption: '',
        field_type: '',
        default_value: ''
      });
    },
    removeField (index) {
      this.fields.splice(index, 1);
    },
    submitFields () {
      this.risk_fields = {fields: this.fields, id: this.id}
      axios.post('http://127.0.0.1:8000/api/add_risk_type_fields/', this.risk_fields).then(resp => {
        this.fields = [{ caption: '', field_type: '', default_value: ''}];
        if (resp.data.status == 'success'){
          this.$swal('Success', 'Fields submitted successfully!', 'success');
        } else {
          this.$swal('Oops..', 'Something went wrong while updating fields!', 'error');
        }
      }).catch(error => {
        console.log(error);
      });
    }
  },
});

let RiskTypeForm = Vue.component('risk-type-form', {
  template: `
  <section>
    <div class="container-fluid" id="risk-type-form">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-md-6">
              <h5 class="card-title">{{ riskType.name }}</h5>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="card-block">
          <form>
            <div class="row" v-for="field in r_fields">
              <div class="form-group col-md-6">
                <label :for="field.id">{{ field.caption }}</label>
                <input :type="field.field_type" class="form-control" :id="field.id"
                 :placeholder="field.default_value" required>
              </div>
            </div>
          </form>
          </div>
        </div>
          <div class="card-footer">
          <!-- <router-link to="/"><button type="submit" class="btn btn-primary"
           @click.prevent="onSubmit">Submit</button></router-link> -->
           <button type="submit" class="btn btn-primary"
            @click.prevent="onSubmit">Submit</button>
        </div>
      </div>
    </div>
  </section>
  `,
  data() {
    return {
      id: this.$route.params.id,
      riskType: {},
      r_fields: null,
    }
  },
  methods: {
    onSubmit() {

    },
  },
  mounted() {
    axios.post('http://127.0.0.1:8000/api/get_risk_type/', {'id': this.id}).then(resp => {
      console.log(resp.data.data);
      this.riskType = resp.data.data.risk_type;
      this.r_fields = resp.data.data.risk_fields;
    }).catch(error => {
      console.log(error);
    });
  }
});

let Customers = Vue.component('customer', {
  template: `
  <div class="container-fluid" id="customers">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-md-10">
              <h4 class="card-title">Customers</h4>
            </div>
            <div class="col-md-2">
              <router-link to="/add-customer"><button type="button"
              name="btnAdd" class="btn btn-primary">Add Customer</button>
              </router-link>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="card-block">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th v-for="header in headers">{{ header }} </th>
                </tr>
              </thead>
              <tbody v-if="dataAvailable">
                <tr v-for="(customer, index) in customers">
                  <td>{{ index + 1 }}</td>
                  <td>{{ customer.name }}</td>
                  <td>{{ customer.phone_number }}</td>
                  <td>{{ customer.email }}</td>
                  <td>{{ customer.gender }}</td>
                  <td>{{ customer.date_of_birth }}</td>
                  <td>{{ customer.state__name }}</td>
                  <td>{{ customer.date_created | date }}</td>
                </tr>
              </tbody>
            </table>
            <center><bar-loader class="custom-class" :loading="loading"
              style="size: 150px color: #bada55"></bar-loader></center>
            <div class="center" v-if="!dataAvailable">
              <center >No data available</center>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      loading: false,
      dataAvailable: false,
      headers: [
        '#', 'Name', 'Phone Number', 'Email', 'Gender',
        'Date of Birth', 'Status', 'Join Date'],
      customers: null,
    }
  },
  mounted() {
    this.loading = true;
    axios.get('http://127.0.0.1:8000/api/customers/').then(resp => {
      this.customers = resp.data.data;
      this.dataAvailable = true;
      this.loading = false;
    }).catch(error => {
      this.loading = false;
      console.log(error);
    });
  }
});

let RegisterCustomer = Vue.component('add-customer', {
  template: `
<section>
  <div class="container-fluid" id="add-risk-type">
    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col-md-10">
            <h5 class="card-title">Register Customer</h5>
          </div>
          <div class="col-md-2">
            <router-link to="/customers"><button type="button" name="back" class="btn
            btn-secondary">Back To All</button></router-link>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="card-block">
          <form>
            <div class="row">
              <div class="form-group col-md-6">
                <label for="first_name">First Name</label>
                <input type="text" class="form-control" id="first_name"
                 v-model="customer_data.first_name" required>
              </div>
              <div class="form-group col-md-6">
                <label for="last_name">Last Name</label>
                <input type="text" class="form-control" id="last_name"
                 v-model="customer_data.last_name" required>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label for="phone_number">Phone Number</label>
                <input type="text" class="form-control" id="phone_number"
                 v-model="customer_data.phone_number" required>
              </div>
              <div class="form-group col-md-6">
                <label for="email">Email</label>
                <input type="email" class="form-control" id="email"
                 v-model="customer_data.email" required>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label for="salutation">Salutation</label>
                <select id="salutation" class="form-control" required v-model="customer_data.salutation">
                  <option value="" disabled> -- Select Salutaion -- </option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Miss</option>
                  <option value="Dr">Doctor</option>
                  <option value="Prof">Professor</option>
                </select>
              </div>
              <div class="form-group col-md-6">
                <label for="gender">Gender</label>
                <select id="gender" class="form-control" required v-model="customer_data.gender">
                  <option value="" disabled> -- Select Gender -- </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <label for="date_of_birth">Date of Birth</label>
                <input type="date" class="form-control" id="last_name"
                 v-model="customer_data.date_of_birth" required>
              </div>
            </div>
            <div class="row">
              <router-link to="/customers"><button type="submit" class="btn btn-primary"
               @click.prevent="onSubmit">Submit</button></router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
  `,
  data() {
    return {
      customer_data: {
        first_name: '',
        last_name: '',
        phone_number: '',
        date_of_birth: '',
        email: '',
        salutation: '',
        gender: ''
      },
    }
  },
  methods : {
    onSubmit() {
      axios.post('http://127.0.0.1:8000/api/register_customer/', this.customer_data).then(resp => {
        if (resp.data.status == 'success'){
          this.$swal('Success', 'Customer registered successfully!', 'success');
        } else {
          if (resp.data.message == 'Provided phone number is already taken') {
            this.$swal('Oops..', 'The customer with that phone number already exists!', 'error');
          } else {
            this.$swal('Oops..', 'Something went wrong while registering Customer!', 'error');
          }
        }
      }).catch(error => {
        console.log(error);
      });
    }
  }
});

// define the routes now
var routes = [
    {path:'/', component: RiskTypes},
    {path:'/add-risk-type', component: AddRiskType},
    {path: '/add-fields', component: ConfigRiskType},
    {path: '/add-fields/:id', component: ConfigRiskType},
    {path: '/risk-type-form/:id', component: RiskTypeForm},
    {path: '/customers', component: Customers},
    {path: '/add-customer', component: RegisterCustomer}
];

let serverUrl = '127.0.0.1';

var router = new VueRouter({ routes:routes });

Vue.filter('date', function(value) {
  if (value) {
    return moment(String(value)).format('YYYY-MM-DD')
  }
});

new Vue({
  el: '#app',
  router,
  data: { },
  components: {'side-nav': SideNav},

});
