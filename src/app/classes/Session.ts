export class Session {
    public nombre!: string; // Marca como definida más adelante
    public usuario!: string;
    public tipoUsuario!: string;
    public id!: number;
  
    constructor(nombre: string, usuario: string, tipoUsuario: string, idAdministrador: number) {
      this.nombre = nombre;
      this.usuario = usuario;
      this.tipoUsuario = tipoUsuario;
      this.id = idAdministrador;
    }
  }
  