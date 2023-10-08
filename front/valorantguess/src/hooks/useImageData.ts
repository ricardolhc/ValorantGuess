import { useQuery } from "@tanstack/react-query"
import axios, { AxiosPromise } from "axios"
import { ImageData } from "../interface/ImageData"

const API_URL = 'http://localhost:8080'

const fetchData = async (): AxiosPromise<ImageData> => {
    const response = axios.get(API_URL + "/abilities/random")
    return response
}

export function useImageData() {

    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['image-data']
    })

    return {
        ...query,
        data: query.data?.data
    }

}