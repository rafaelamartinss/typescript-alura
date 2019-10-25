export function throttle(milissegundos = 500) {

    return function name(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        
        const metodoOriginal = descriptor.value;
        let timer = 0;

        descriptor.value = function (...args: any[]) {
            if(event) event.preventDefault();

            clearInterval(timer);
            setTimeout(() => {
                metodoOriginal.apply(this, args);                
            }, milissegundos);
        }

        return descriptor;
    }
}