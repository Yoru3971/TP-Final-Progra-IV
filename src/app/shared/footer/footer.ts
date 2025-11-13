import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { RegisterPageCliente } from "../../pages/register-page-cliente/register-page-cliente";

@Component({
  selector: 'app-footer',
  imports: [RouterLink, RegisterPageCliente],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

}
