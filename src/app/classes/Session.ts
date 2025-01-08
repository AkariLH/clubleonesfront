export class Session {
    public nombre!: string; // Marca como definida más adelante
    public usuario!: string;
    public tipoUsuario!: string;
  
    constructor(nombre: string, usuario: string, tipoUsuario: string) {
      this.nombre = nombre;
      this.usuario = usuario;
      this.tipoUsuario = tipoUsuario;
    }
  }
  