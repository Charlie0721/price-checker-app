<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>
                    <h3 class="letter-color">Chequeador de Precios</h3>
                </ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>

            <ion-card>

                <img class="edit-image" src="@/icon/logo_header.png" />
                <h2 class="letter-color"> CONEXION POS CHECKER </h2>
                <ion-item>
                    <ion-input type="text" :value="barcode.barcode" @input="barcode.barcode = $event.target.value"
                        placeholder="Código de barras" :clear-input="true" @keypress.enter="searchByBarcode()"></ion-input>
                </ion-item>

            </ion-card>
            <ion-card>


                <ion-card-content>

                    <h1 class="letter-color" v-for="item in productPrices" :key="item.barcode">
                        <small>{{ item.descripcion }}</small>
                        <br />

                        <small>

                            $ {{
                                new Intl.NumberFormat("de-DE").format(priceWithIco = item.precioventa + item.valorico)
                            }}</small><br />
                        <small>{{ item.barcode }}</small>
                        <br />
                        <small>{{ item.codigo }}</small>
                        <br />
                    </h1>

                    <h1 class="letter-color" v-if="totalPrices">
                        <small>
                            Valor Total: ${{
                                new Intl.NumberFormat("de-DE").format(totalPrices)
                            }}
                        </small>
                    </h1>
                    <h1 class="letter-color" v-if="amountItems">
                        <small>Cantidad de Productos: {{ amountItems }}</small>
                        <small> </small>
                    </h1>

                </ion-card-content>

            </ion-card>
        </ion-content>

    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    alertController,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonLabel,
    IonButton,
    IonInput,
    IonItem,
} from "@ionic/vue";
import { PriceChecker } from '../services/prices-checker'
import { PriceCheckerInterface } from '../interfaces/barcode.interface';
export default defineComponent({
    name: "PriceChecker",
    components: {
        IonPage,
        IonInput,
        //  IonLabel,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonCard, IonItem,
        IonContent,
        IonCardContent

    },
    data() {
        return {
            barcode: {} as PriceCheckerInterface,
            productPrices: [] as any,
            totalPrices: null,
            amountItems: 0,
            searchItem: false,
            priceWithIco: 0
        }
    },
    methods: {
        async searchByBarcode() {

            try {
                const response = await PriceChecker.getPriceasync(this.barcode)
                if (response.data.length === 0) {

                    const alert = await alertController.create({
                        cssClass: "my-custom-class",
                        header: "Atención !!!",
                        message: "Producto no existe",
                        buttons: ["OK"],
                    });
                    await alert.present();
                    this.barcode.barcode = "";
                }
                this.productPrices = response.data

                for (let i = 0; i < this.productPrices.length; i++) {

                    this.totalPrices += this.productPrices[i].precioventa + this.productPrices[i].valorico;
                    this.amountItems++;
                }
                this.barcode.barcode = "";
                setInterval(() => {
                    this.reloadPage();
                }, 20000);
            } catch (error) {
                console.log(error)
                const alert = await alertController.create({
                    cssClass: "my-custom-class",
                    header: "Error !!!",
                    message: `error: ${error.message}`,
                    buttons: ["OK"],
                });
                await alert.present();
            }
        },
        reloadPage() {
            location.reload();
        },
    }
})
</script>

<style scoped>
.letter-color {
    color: #82230d;
    text-shadow: 1px 1px #fff;
    text-align: center;
}

.custom-input-container .native-input {
    border-radius: 10px;
}

.edit-image {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 7%;
    max-height: 7%;

}
</style>
