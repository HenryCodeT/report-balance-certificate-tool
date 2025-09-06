// hooks/useTireData.ts
import { useState, useCallback } from "react";
import { TireData, Photo, TireFormFields } from "@/models/interface";

const initialTireData: TireData[] = [
    {
        id: 1,
        position: "LH1",
        contrapesoInterior: 0,
        contrapesoExterior: 0,
        photos: [],
    },
    {
        id: 2,
        position: "RH1",
        contrapesoInterior: 0,
        contrapesoExterior: 0,
        photos: [],
    },
    {
        id: 3,
        position: "LH2",
        contrapesoInterior: 0,
        contrapesoExterior: 0,
        photos: [],
    },
    {
        id: 4,
        position: "RH2",
        contrapesoInterior: 0,
        contrapesoExterior: 0,
        photos: [],
    },
];

export const useTireData = () => {
    const [tireData, setTireData] = useState<TireData[]>(initialTireData);

    const updateTireField = useCallback(
        (index: number, field: TireFormFields, value: number) => {
            setTireData((prev) => {
                const newData = [...prev];
                newData[index][field] = value;
                return newData;
            });
        },
        []
    );

    const updateTireCount = useCallback((count: "2" | "4") => {
        setTireData((prev) => {
            if (count === "2") {
                return prev.slice(0, 2);
            } else {
                return [...prev, ...initialTireData.slice(prev.length)];
            }
        });
    }, []);

    const addPhotos = useCallback(
        (tireIndex: number, newPhotos: Photo[], maxPhotos = 2) => {
            setTireData((prev) => {
                const newData = [...prev];
                const updatedPhotos = [
                    ...newData[tireIndex].photos,
                    ...newPhotos,
                ].slice(0, maxPhotos);
                newData[tireIndex] = {
                    ...newData[tireIndex],
                    photos: updatedPhotos,
                };
                return newData;
            });
        },
        []
    );

    const removePhoto = useCallback((tireIndex: number, photoId: number) => {
        setTireData((prev) => {
            const newData = [...prev];
            newData[tireIndex].photos = newData[tireIndex].photos.filter(
                (photo) => photo.id !== photoId
            );
            return newData;
        });
    }, []);

    const resetTireData = useCallback(() => {
        setTireData(initialTireData);
    }, []);

    return {
        tireData,
        updateTireField,
        updateTireCount,
        addPhotos,
        removePhoto,
        resetTireData,
    };
};
