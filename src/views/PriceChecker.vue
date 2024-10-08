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

                    <input ref="barcodeInput" type="text" :value="barcode.barcode" @input="handleInput"
                        placeholder="Código de barras" @keypress.enter="searchByBarcode" />
                </ion-item>

            </ion-card>
            <ion-card v-if="productPrices.length > 0">


                <ion-card-content>

                    <!-- <h1 class="letter-color large-text" v-for="item in productPrices" :key="item.barcode">
                        <small>{{ item.descripcion }}</small>
                        <br />
                        <small>$ {{ new Intl.NumberFormat("de-DE").format(priceWithIco = item.precioventa +
                            item.valorico) }}</small>
                        <br />
                        <small>{{ item.barcode }}</small>
                        <br />
                     
                    </h1> -->

                    <div v-for="item in productPrices" :key="item.barcode"
                        style="text-align: center; margin-bottom: 20px;">
                        <h1 class="letter-color large-text">
                            {{ item.descripcion }}
                        </h1>
                        <h1 class="letter-color large-text">
                            $ {{ new Intl.NumberFormat("de-DE").format(priceWithIco = item.precioventa + item.valorico)
                            }}
                        </h1>
                        <small>
                            <h1 class="letter-color large-text">

                                {{ item.barcode }}
                            </h1>

                        </small>
                    </div>



                    <h1 class="letter-color large-text" v-if="totalPrices">
                        <small>
                            Valor Total: ${{
                                new Intl.NumberFormat("de-DE").format(totalPrices)
                            }}
                        </small>
                    </h1>
                    <h1 class="letter-color large-text" v-if="amountItems">
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
    //  IonInput,
    IonItem,
} from "@ionic/vue";
import { PriceChecker } from '../services/prices-checker'
import { PriceCheckerInterface } from '../interfaces/barcode.interface';
export default defineComponent({
    name: "PriceChecker",
    components: {
        IonPage,
        // IonInput,
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
            priceWithIco: 0,

        }
    },
    mounted() {
        setTimeout(() => {
            const inputElement = this.$refs.barcodeInput as HTMLInputElement;
            if (inputElement) {
                inputElement.focus();
            }
        }, 100);
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
                    message: `error: ${error}`,
                    buttons: ["OK"],
                });
                await alert.present();
            }
        },
        handleInput(event: Event) {
            const target = event.target as HTMLInputElement;
            this.barcode.barcode = target.value;

            if (target.value === '') {
                target.value = '';
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


.edit-image {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 7%;
    max-height: 7%;

}

.large-text {
    font-size: 4.0em;
    /* Ajusta el tamaño como desees */
}

input {
    border: 2px solid #82230d;
    /* Cambia el color del borde al color de .letter-color */
    border-radius: 20px;
    /* Bordes redondeados */
    padding: 15px;
    /* Espaciado interno */
    font-size: 16px;
    /* Tamaño de fuente */
    width: calc(100% - 40px);
    /* Ancho casi total de la pantalla (restando márgenes) */
    max-width: 970px;
    /* Aumentar ancho máximo para que sea más ancho */
    transition: border-color 0.3s;
    /* Transición suave para el borde */
    box-sizing: border-box;
    /* Incluye el padding y el borde en el tamaño total */
    display: block;
    /* Para centrar correctamente el input */
    margin: 20px auto;
    /* Centrando el input con márgenes automáticos y un poco de espacio vertical */
}

.price {
    font-size: 2.5em;
    color: #82230d;
    /* Color corporativo para el precio */
    margin: 10px 0;
    /* Espaciado entre el precio y los demás elementos */
}

.barcode {
    font-size: 1.5em;
    color: #82230d;
    /* Color más claro para el código de barras */
}

/* Cambiar el color del borde al enfocar */
input:focus {
    border-color: #82230d;
    /* Color del borde al tener foco */
    outline: none;
    /* Quitar el borde azul del navegador */
}

/* Cambiar el fondo cuando el input está vacío */
input::placeholder {
    color: #82230d;
    /* Color del texto del placeholder */
    opacity: 2;
    /* Asegura que el placeholder se muestre claramente */
}
</style>
