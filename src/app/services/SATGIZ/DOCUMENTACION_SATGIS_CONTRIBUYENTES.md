# Documentación API - Módulos Contribuyente y Ubicación Contribuyente

## Módulo Contribuyente

### Modelo de Datos

```typescript
interface Contribuyente {
  c_num_documento: string; // Clave primaria (15 caracteres)
  c_tipo_documento: string; // Tipo de documento (10 caracteres)
  c_tipo_contribuyente: string; // Tipo de contribuyente (50 caracteres)
  c_nombre: string; // Nombre o razón social (100 caracteres)
  c_condicion_especial: string; // Condición especial (50 caracteres, opcional)
  c_telefono: string; // Teléfono (20 caracteres, opcional)
  c_correo_electronico: string; // Correo electrónico (100 caracteres, opcional)
}
```

### Endpoints Disponibles

#### 1. Obtener todos los contribuyentes

- **Método:** GET
- **URL:** `/contribuyentes`
- **Respuesta Exitosa (200):**

```json
[
  {
    "c_num_documento": "12345678901",
    "c_tipo_documento": "DNI",
    "c_tipo_contribuyente": "Persona Natural",
    "c_nombre": "JUAN PEREZ GARCIA",
    "c_condicion_especial": "Ninguna",
    "c_telefono": "987654321",
    "c_correo_electronico": "juan@example.com"
  }
]
```

#### 2. Obtener contribuyente por documento

- **Método:** GET
- **URL:** `/contribuyentes/search_by_id/:c_num_documento`
- **Parámetros URL:** `c_num_documento` (string)
- **Respuesta Exitosa (200):**

```json
{
  "c_num_documento": "12345678901",
  "c_tipo_documento": "DNI",
  "c_tipo_contribuyente": "Persona Natural",
  "c_nombre": "JUAN PEREZ GARCIA",
  "c_condicion_especial": "Ninguna",
  "c_telefono": "987654321",
  "c_correo_electronico": "juan@example.com"
}
```

#### 3. Crear nuevo contribuyente

- **Método:** POST
- **URL:** `/contribuyentes`
- **Body:**

```json
{
  "c_num_documento": "12345678901",
  "c_tipo_documento": "DNI",
  "c_tipo_contribuyente": "Persona Natural",
  "c_nombre": "JUAN PEREZ GARCIA",
  "c_condicion_especial": "Ninguna",
  "c_telefono": "987654321",
  "c_correo_electronico": "juan@example.com"
}
```

- **Respuesta Exitosa (200):** Retorna el contribuyente creado

#### 4. Actualizar contribuyente

- **Método:** PUT
- **URL:** `/contribuyentes/:c_num_documento`
- **Parámetros URL:** `c_num_documento` (string)
- **Body:** (mismos campos que crear, excepto c_num_documento)

```json
{
  "c_tipo_documento": "DNI",
  "c_tipo_contribuyente": "Persona Natural",
  "c_nombre": "JUAN PEREZ GARCIA ACTUALIZADO",
  "c_condicion_especial": "Especial",
  "c_telefono": "987654322",
  "c_correo_electronico": "juan.actualizado@example.com"
}
```

#### 5. Eliminar contribuyente

- **Método:** DELETE
- **URL:** `/contribuyentes/:c_num_documento`
- **Parámetros URL:** `c_num_documento` (string)
- **Respuesta Exitosa (200):** Número de registros eliminados

---

## Módulo Ubicación Contribuyente

### Modelo de Datos

```typescript
interface UbicacionContribuyente {
  n_id: number; // ID autoincremental (clave primaria)
  c_num_documento: string; // Referencia al contribuyente (15 caracteres)
  c_departamento: string; // Departamento (50 caracteres)
  c_provincia: string; // Provincia (50 caracteres)
  c_distrito: string; // Distrito (50 caracteres)
  c_codigo_via: string; // Código de vía (20 caracteres, opcional)
  c_tipo_via: string; // Tipo de vía (50 caracteres, opcional)
  c_nombre_via: string; // Nombre de la vía (50 caracteres, opcional)
  c_nro_municipal: string; // Número municipal (20 caracteres, opcional)
  c_manzana: string; // Manzana (20 caracteres, opcional)
  c_lote: string; // Lote (20 caracteres, opcional)
  c_sector: string; // Sector (50 caracteres, opcional)
  c_ubicacion: string; // Ubicación (100 caracteres, opcional)
  c_zona_predio: string; // Zona del predio (100 caracteres, opcional)
  c_cod_hu: string; // Código HU (20 caracteres, opcional)
  c_nombre_habilitacion: string; // Nombre habilitación (100 caracteres, opcional)
  c_nombre_edificacion: string; // Nombre edificación (100 caracteres, opcional)
  c_nro_interior: string; // Número interior (20 caracteres, opcional)
  c_sub_lote: string; // Sub lote (20 caracteres, opcional)
  c_grupo_residencial: string; // Grupo residencial (50 caracteres, opcional)
}
```

### Endpoints Disponibles

#### 1. Obtener todas las ubicaciones

- **Método:** GET
- **URL:** `/ubicacion_contribuyente`
- **Respuesta Exitosa (200):**

```json
[
  {
    "n_id": 1,
    "c_num_documento": "12345678901",
    "c_departamento": "LIMA",
    "c_provincia": "LIMA",
    "c_distrito": "MIRAFLORES",
    "c_codigo_via": "AV001",
    "c_tipo_via": "AVENIDA",
    "c_nombre_via": "AVENIDA LARCO",
    "c_nro_municipal": "123",
    "c_manzana": "MZ A",
    "c_lote": "LOTE 5",
    "c_sector": "URBANIZACIÓN",
    "c_ubicacion": "FRENTE AL PARQUE",
    "c_zona_predio": "RESIDENCIAL",
    "c_cod_hu": "HU001",
    "c_nombre_habilitacion": "RESIDENCIAL SAN ANTONIO",
    "c_nombre_edificacion": "EDIFICIO MIRAMAR",
    "c_nro_interior": "401",
    "c_sub_lote": "SL001",
    "c_grupo_residencial": "TORRE A"
  }
]
```

#### 2. Obtener ubicación por ID

- **Método:** GET
- **URL:** `/ubicacion_contribuyente/:n_id`
- **Parámetros URL:** `n_id` (número)
- **Respuesta Exitosa (200):** Retorna la ubicación específica

#### 3. Crear nueva ubicación

- **Método:** POST
- **URL:** `/ubicacion_contribuyente`
- **Body:**

```json
{
  "c_num_documento": "12345678901",
  "c_departamento": "LIMA",
  "c_provincia": "LIMA",
  "c_distrito": "MIRAFLORES",
  "c_codigo_via": "AV001",
  "c_tipo_via": "AVENIDA",
  "c_nombre_via": "AVENIDA LARCO",
  "c_nro_municipal": "123",
  "c_manzana": "MZ A",
  "c_lote": "LOTE 5",
  "c_sector": "URBANIZACIÓN",
  "c_ubicacion": "FRENTE AL PARQUE",
  "c_zona_predio": "RESIDENCIAL",
  "c_cod_hu": "HU001",
  "c_nombre_habilitacion": "RESIDENCIAL SAN ANTONIO",
  "c_nombre_edificacion": "EDIFICIO MIRAMAR",
  "c_nro_interior": "401",
  "c_sub_lote": "SL001",
  "c_grupo_residencial": "TORRE A"
}
```

#### 4. Actualizar ubicación

- **Método:** PUT
- **URL:** `/ubicacion_contribuyente/:n_id`
- **Parámetros URL:** `n_id` (número)
- **Body:** (todos los campos actualizables)

#### 5. Eliminar ubicación

- **Método:** DELETE
- **URL:** `/ubicacion_contribuyente/:n_id`
- **Parámetros URL:** `n_id` (número)

---

## Relaciones entre Entidades

- **Contribuyente** (1) ↔ (N) **UbicacionContribuyente**
- Cada ubicación está asociada a un contribuyente mediante `c_num_documento`
- Un contribuyente puede tener múltiples ubicaciones

### Ejemplo de Consulta Relacionada

Para obtener un contribuyente con todas sus ubicaciones:

1. Primero obtener el contribuyente: `GET /contribuyentes/search_by_id/12345678901`
2. Luego obtener sus ubicaciones: `GET /ubicacion_contribuyente` y filtrar por `c_num_documento`

---

## Manejo de Errores

Todas las respuestas de error siguen el formato:

```json
{
  "error": "Mensaje descriptivo del error"
}
```

**Códigos de Estado:**

- `200`: Operación exitosa
- `500`: Error interno del servidor

---

## Notas Importantes

1. **Validaciones:**

   - `c_num_documento`, `c_tipo_documento`, `c_tipo_contribuyente`, `c_nombre` son campos obligatorios
   - `c_departamento`, `c_provincia`, `c_distrito` son obligatorios en ubicaciones
   - Los demás campos son opcionales

2. **Longitudes Máximas:**

   - Documentos: 15 caracteres
   - Nombres: 100 caracteres
   - Ubicaciones: 50-100 caracteres según el campo

3. **Base de Datos:**

   - Schema: `satgis`
   - Sin timestamps automáticos
   - Nombres de tablas fijos

4. **Convenciones:**
   - Todos los campos en español
   - Prefijos: `c_` para strings, `n_` para números
   - Nombres descriptivos en snake_case

---

## Ejemplo de Implementación Frontend

### JavaScript/TypeScript

```typescript
// Obtener todos los contribuyentes
const getContribuyentes = async () => {
  try {
    const response = await fetch("/contribuyentes");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener contribuyentes:", error);
  }
};

// Crear nuevo contribuyente
const createContribuyente = async (contribuyenteData) => {
  try {
    const response = await fetch("/contribuyentes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contribuyenteData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear contribuyente:", error);
  }
};
```

### React Hook Example

```typescript
import { useState, useEffect } from "react";

const useContribuyentes = () => {
  const [contribuyentes, setContribuyentes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContribuyentes = async () => {
    setLoading(true);
    try {
      const response = await fetch("/contribuyentes");
      const data = await response.json();
      setContribuyentes(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContribuyentes();
  }, []);

  return { contribuyentes, loading, refetch: fetchContribuyentes };
};
```
