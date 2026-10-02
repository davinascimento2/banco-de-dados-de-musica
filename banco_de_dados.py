"""
AudioVault - Music Database Manager (SQLite CLI)
Author: Davi Nascimento
"""

import sqlite3
import os
import sys

DB_NAME = "musicas.db"

def conectar():
    """Conecta ao banco de dados SQLite."""
    return sqlite3.connect(DB_NAME)

def criar_tabela(conn):
    """Inicializa as tabelas de músicas, artistas e playlists."""
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS musicas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        artista TEXT NOT NULL,
        album TEXT NOT NULL,
        ano INTEGER NOT NULL,
        genero TEXT DEFAULT 'Synthwave',
        bpm INTEGER DEFAULT 120,
        duracao TEXT DEFAULT '3:45'
    )
    ''')
    conn.commit()

def popular_dados_iniciais(conn):
    """Insere faixas de demonstração se a tabela estiver vazia."""
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM musicas')
    if cursor.fetchone()[0] == 0:
        musicas_demo = [
            ("Resonance", "HOME", "Odyssey", 2014, "Chillwave", 105, "3:32"),
            ("Nightcall", "Kavinsky", "OutRun", 2010, "Synthwave", 94, "4:19"),
            ("Tech Noir", "Gunship", "Gunship", 2015, "Darksynth", 112, "4:57"),
            ("Turbo Killer", "Carpenter Brut", "Trilogy", 2015, "Cyberpunk", 140, "3:28"),
            ("Sunset", "The Midnight", "Endless Summer", 2016, "Retrowave", 118, "5:26"),
            ("Vortex", "Davi Nascimento", "Cyber Chronos", 2026, "Cyberpunk Synth", 128, "3:50"),
        ]
        cursor.executemany('''
        INSERT INTO musicas (titulo, artista, album, ano, genero, bpm, duracao)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', musicas_demo)
        conn.commit()
        print("[+] Banco inicializado com 6 faixas demo.")

def adicionar_musica(conn, titulo, artista, album, ano, genero="Synthwave", bpm=120, duracao="3:30"):
    """Cadastra uma nova música."""
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO musicas (titulo, artista, album, ano, genero, bpm, duracao)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (titulo, artista, album, ano, genero, bpm, duracao))
    conn.commit()
    print(f"[✓] Música '{titulo}' de {artista} adicionada com sucesso!")

def listar_musicas(conn):
    """Retorna todas as músicas cadastradas."""
    cursor = conn.cursor()
    cursor.execute('SELECT id, titulo, artista, album, ano, genero, bpm, duracao FROM musicas ORDER BY id ASC')
    return cursor.fetchall()

def buscar_musica(conn, termo):
    """Busca músicas por título, artista ou álbum."""
    cursor = conn.cursor()
    cursor.execute('''
    SELECT id, titulo, artista, album, ano, genero, bpm, duracao 
    FROM musicas 
    WHERE titulo LIKE ? OR artista LIKE ? OR album LIKE ?
    ''', (f"%{termo}%", f"%{termo}%", f"%{termo}%"))
    return cursor.fetchall()

def remover_musica(conn, musica_id):
    """Remove uma música pelo ID."""
    cursor = conn.cursor()
    cursor.execute('DELETE FROM musicas WHERE id = ?', (musica_id,))
    conn.commit()
    print(f"[✓] Música com ID {musica_id} removida com sucesso!")

def exibir_tabela(musicas):
    """Imprime tabela formatada no terminal."""
    if not musicas:
        print("\n[!] Nenhuma música encontrada.")
        return
    
    print("\n" + "="*80)
    print(f"{'ID':<4} | {'TÍTULO':<22} | {'ARTISTA':<18} | {'ANO':<6} | {'GÊNERO':<14} | {'BPM':<5}")
    print("="*80)
    for m in musicas:
        print(f"{m[0]:<4} | {m[1]:<22} | {m[2]:<18} | {m[4]:<6} | {m[5]:<14} | {m[6]:<5}")
    print("="*80 + "\n")

def menu_principal():
    conn = conectar()
    criar_tabela(conn)
    popular_dados_iniciais(conn)

    while True:
        print("\n--- 🎵 AUDIOVAULT // MUSIC DATABASE CLI ---")
        print("1. Listar todas as músicas")
        print("2. Buscar música por título/artista")
        print("3. Adicionar nova música")
        print("4. Remover música por ID")
        print("5. Sair")
        
        opcao = input("\nEscolha uma opção (1-5): ").strip()
        if opcao == "1":
            musicas = listar_musicas(conn)
            exibir_tabela(musicas)
        elif opcao == "2":
            termo = input("Digite o termo de busca: ").strip()
            musicas = buscar_musica(conn, termo)
            exibir_tabela(musicas)
        elif opcao == "3":
            titulo = input("Título: ").strip()
            artista = input("Artista: ").strip()
            album = input("Álbum: ").strip()
            try:
                ano = int(input("Ano: ").strip())
            except ValueError:
                ano = 2024
            genero = input("Gênero (ex: Synthwave, Cyberpunk): ").strip() or "Synthwave"
            adicionar_musica(conn, titulo, artista, album, ano, genero)
        elif opcao == "4":
            try:
                m_id = int(input("ID da música a remover: ").strip())
                remover_musica(conn, m_id)
            except ValueError:
                print("[!] ID inválido.")
        elif opcao == "5":
            print("\n[✓] Encerrando AudioVault. Até logo!\n")
            conn.close()
            break
        else:
            print("[!] Opção inválida.")

if __name__ == "__main__":
    menu_principal()
