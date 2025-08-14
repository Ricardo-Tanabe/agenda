"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { createNote } from "@/lib/actions/notes/createNote";
import { updateNote } from "@/lib/actions/notes/updateNote";
import { deleteNote } from "@/lib/actions/notes/deleteNotes";

interface Note {
    id: string;
    note: string;
    createdAt: Date;
}

interface Props {
    notes: Note[];
    taskId: string;
}

export default function TaskNotes({ notes, taskId }: Props) {
    const [newNote, setNewNote] = useState("");
    const [editing, setEditing] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    async function handleAddNote() {
        setError(null);

        if (!newNote.trim()) {
            setError("A nota não pode estar vazia.");
            return;
        }

        startTransition(async () => {
            const result = await createNote(taskId, newNote);
            if ("error" in result) {
                setError(typeof result.error === "string" ? result.error : "Erro ao adicionar nota.");
            } else {
                setNewNote("");
                router.refresh();
            }
        })
    }

    async function handleUpdateNote(noteId: string) {
        setError(null);

        if (!editingValue.trim()) {
            setError("A nota não pode estar vazia.");
            return;
        }

        startTransition(async () => {
            const result = await updateNote(noteId, editingValue);
            if ("error" in result) {
                setError(typeof result.error === "string" ? result.error : "Erro ao atualizar nota.");
            } else {
                setEditing(null);
                router.refresh();
            }
        })
    }

    async function handleDeleteNote(noteId: string) {
        setError(null);

        startTransition(async () => {
            const result = await deleteNote(noteId);
            if ("error" in result) {
                setError(typeof result.error === "string" ? result.error : "Erro ao excluir nota.");
            } else {
                router.refresh();
            }
        })
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2 handwritten">Notas</h2>

            {error && (<div className="text-sm text-red-600 mb-2">{error}</div>)}

            <ul className="space-y-4 mb-6">
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <li key={note.id} className="bg-white dark:bg-zinc-800
                        border border-gray-300 dark:border-gray-700 rounded-lg
                        p-3 shadow-sm">
                            {editing === note.id ? (
                                <>
                                <textarea
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    className="input-base mb-2"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleUpdateNote(note.id)}
                                        className="btn-primary text-sm"
                                    >
                                        Salvar
                                    </button>
                                    <button
                                        onClick={() => setEditing(null)}
                                        className="btn-secondary text-sm"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                                </>
                            ) : (
                                <>
                                <p className="text-sm whitespace-pre-line">{note.note}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {format(new Date(note.createdAt), "dd/MM/yyyy HH:mm", {
                                        locale: ptBR,
                                    })}
                                </p>
                                <div className="mt-1">
                                    <button
                                        onClick={() => {
                                            setEditing(note.id);
                                            setEditingValue(note.note);
                                        }}
                                        className="text-xs text-blue-600
                                        dark:text-blue-400 hover:underline"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteNote(note.id)}
                                        className="ml-2 text-xs text-red-600
                                        dark:text-red-400 hover:underline"
                                    >
                                        Excluir
                                    </button>
                                </div>
                                </>
                            )}
                        </li>
                    ))
                ) : (
                    <li className="text-sm text-gray-500">Sem notas</li>
                )}
            </ul>

            <div>
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Adicionar nova nota"
                    className="input-base"
                />
                <button
                    onClick={handleAddNote}
                    disabled={isPending}
                    className="mt-2 btn-primary"
                >
                    Adicionar Nota
                </button>
            </div>
        </div>
    )
}