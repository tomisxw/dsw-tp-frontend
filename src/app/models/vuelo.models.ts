export interface Vuelo {
    id_vuelo:                number;
    numero_vuelo :           number;
    fecha_salida:            Date;
    fecha_llegada:           Date; 
    estado:                  string;
    id_avion:                number;
    id_aeropuerto_origen:    number;
    id_aeropuerto_destino:   number;
}