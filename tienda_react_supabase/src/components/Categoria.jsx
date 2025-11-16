import AdminCategoriaContext from "../context/AdminCategoriaProvider";
import { useContext} from "react";

export default function Categoria({categoria}){
    const {handleClickCategoria,categoriaActual} = useContext(AdminCategoriaContext);
    const {imagen, id, nombre} = categoria

    return (
        <div className={`${categoriaActual.id === id ? "bg-amber-400" : 'bg-white'} flex items-center gap-4 border w-full p-3 hover:bg-amber-400 cursor-pointer`}>

            <img
                alt="Imagen Icono"
                src={imagen}
                className="w-12"
            />

            <button className="text-lg font-bold cursor-pointer truncate" type="button" onClick={() => handleClickCategoria(id)}>{nombre}</button>
        </div>
    )

}