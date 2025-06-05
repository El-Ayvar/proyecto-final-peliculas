import random

class TabuSearchKnapsack:
    def __init__(self, objects, capacity, max_iterations=100, tabu_size=10, penalty=1000):
        """
        Inicializa la Búsqueda Tabú para el problema de la mochila.
        
        :param objects: Lista de tuplas (valor, peso).
        :param capacity: Capacidad máxima de la mochila.
        :param max_iterations: Número máximo de iteraciones.
        :param tabu_size: Tamaño de la lista tabú.
        :param penalty: Penalización por exceder la capacidad.
        """
        self.objects = objects
        self.capacity = capacity
        self.max_iterations = max_iterations
        self.tabu_size = tabu_size
        self.penalty = penalty
        self.n = len(objects)
    
    def evaluate(self, solution):
        """Calcula el valor total de la solución, aplicando penalización si excede la capacidad."""
        total_value = 0
        total_weight = 0
        for i in range(self.n):
            if solution[i]:
                total_value += self.objects[i][0]
                total_weight += self.objects[i][1]
        # Penalización si se excede la capacidad
        if total_weight > self.capacity:
            total_value -= self.penalty * (total_weight - self.capacity)
        return total_value
    
    def generate_initial_solution(self):
        """Genera una solución inicial aleatoria."""
        return [random.randint(0, 1) for _ in range(self.n)]
    
    def get_neighbors(self, solution):
        """Genera vecinos cambiando el estado de un objeto (flip)."""
        neighbors = []
        for i in range(self.n):
            neighbor = solution.copy()
            neighbor[i] = 1 - neighbor[i]  # Flip: 0→1 o 1→0
            neighbors.append((neighbor, i))  # Guardamos el índice modificado
        return neighbors
    
    def solve(self):
        """Ejecuta la Búsqueda Tabú."""
        # Inicialización
        current_solution = self.generate_initial_solution()
        best_solution = current_solution.copy()
        best_value = self.evaluate(best_solution)
        tabu_list = []
        
        # Búsqueda
        for _ in range(self.max_iterations):
            neighbors = self.get_neighbors(current_solution)
            best_neighbor = None
            best_neighbor_value = -float('inf')
            
            for neighbor, move in neighbors:
                neighbor_value = self.evaluate(neighbor)
                
                # Si el movimiento no está tabú o mejora la mejor solución global
                if (move not in tabu_list) or (neighbor_value > best_value):
                    if neighbor_value > best_neighbor_value:
                        best_neighbor = neighbor
                        best_neighbor_value = neighbor_value
                        best_move = move
            
            # Actualizar la solución actual y la lista tabú
            if best_neighbor:
                current_solution = best_neighbor
                tabu_list.append(best_move)
                if len(tabu_list) > self.tabu_size:
                    tabu_list.pop(0)
                
                # Actualizar la mejor solución global
                if best_neighbor_value > best_value:
                    best_solution = best_neighbor.copy()
                    best_value = best_neighbor_value
        
        # Filtrar solo objetos seleccionados (útil si hay penalización)
        selected_objects = [self.objects[i] for i in range(self.n) if best_solution[i]]
        total_weight = sum(w for (v, w) in selected_objects)
        
        return {
            "selected_objects": selected_objects,
            "total_value": sum(v for (v, w) in selected_objects),
            "total_weight": total_weight,
            "is_valid": total_weight <= self.capacity
        }